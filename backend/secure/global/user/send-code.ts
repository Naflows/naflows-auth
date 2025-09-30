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


    const codeSuccess = await secure.code.create(user, service, "SELF_SERVICE_MANAGEMENT");
    if (!codeSuccess.success || codeSuccess.status === 201) {
        return codeSuccess;
    }
    const codeNumber = codeSuccess.data?.code;


    const mail = await mailing.send(
        service.name,
        user.email,
        `Verification Code for ${service.name}`,
        (await mailing.patterns.customCode(user, service.name, codeNumber)) as string
    );

    if (!mail.success) {
        return software.methods.serverReply(500, "Failed to send verification code email. " + mail.message);
    }




    return software.methods.serverReply(200, "Verification code sent successfully.");
}
