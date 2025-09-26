import { db } from "../../..";
import { software } from "../../../software/dir";
import mailing from "../../../software/mailing/dir";
import { SecurityCode, User } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import { services } from "../../services/dir";
import secure from "../dir";
import crypto from 'crypto';


export async function sendVerificationCode(userId: string, serviceID : string): Promise<ReplyType> {

    const user = await secure.user.get(userId, false) as User;
    if (!user) {
        return software.methods.serverReply(404, "User not found.");
    }

    const serviceRT = await services.service.get(serviceID);
    if (!serviceRT.success) {
        return software.methods.serverReply(404, "Service not found.");
    }
    const service = serviceRT.data as any;

    const codeNumber = Math.floor(100000 + Math.random() * 900000).toString();

    const code : SecurityCode = {
        id : crypto.randomUUID(),
        user_id : secure.hash(user.id),
        code : secure.hash(codeNumber),
        purpose: "TWO_FACTOR_AUTHENTICATION",
        created_at : new Date().getTime(),
        expires_at : new Date().getTime() + (10 * 60 * 1000), // 10 minutes from now
        used : false,
        used_at : null,
        associated_service : secure.hash(service.id),
    }

    const mail = await mailing.send(
        service.name,
        user.email,
        "Verification Code",
        (await mailing.patterns.customCode(user, service.name, codeNumber)) as string
    );

    if (!mail.success) {
        return software.methods.serverReply(500, "Failed to send verification code email. " + mail.message);
    }


    const dbRt = await db.collection('security_codes').insertOne(code);
    if (!dbRt.acknowledged) {
        return software.methods.serverReply(500, "Failed to store verification code.");
    }

    return software.methods.serverReply(200, "Verification code sent successfully.");
}
