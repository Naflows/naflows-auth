import { all } from "axios";
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


    // Check if there is already a valid code for this user and service
    const allCodes = await db.collection('security_codes').find({
        purpose: "TWO_FACTOR_AUTHENTICATION",
        used: false,
    }).toArray();
    const validCode = allCodes.find(c => secure.verify(user.id, c.user_id) && secure.verify(service.id, c.associated_service) && c.expires_at > new Date().getTime());
    if (validCode) {
        return software.methods.serverReply(200, "A valid code has already been sent to your email. Please check your inbox.");
    }


    const codeNumber = Math.floor(100000 + Math.random() * 900000).toString();

    const code : SecurityCode = {
        id : crypto.randomUUID(),
        user_id : secure.crypt(user.id),
        code : secure.crypt(codeNumber),
        purpose: "TWO_FACTOR_AUTHENTICATION",
        created_at : new Date().getTime(),
        expires_at : new Date().getTime() + (10 * 60 * 1000), // 10 minutes from now
        used : false,
        used_at : null,
        associated_service : secure.crypt(service.id),
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
