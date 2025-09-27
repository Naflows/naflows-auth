import { db } from "../../../..";
import { software } from "../../../../software/dir";
import { SecurityCode, Service, User } from "../../../../types/.types/collections.type";
import { ReplyType } from "../../../../types/.types/reply.type";
import { services } from "../../../services/dir";
import secure from "../../dir";
import crypto from 'crypto';


export async function createSecurityCode(user: User, service : Service, purpose: SecurityCode["purpose"]) : Promise<ReplyType> {
    // Check if there is already a valid code for this user and service
    const allCodes = await db.collection('security_codes').find({
        purpose: purpose,
        used: false,
    }).toArray();
    const validCode = allCodes.find(c => secure.verify(user.id, c.user_id) && secure.verify(service.id, c.associated_service) && c.expires_at > new Date().getTime());
    if (validCode) {
        return software.methods.serverReply(201, "A valid code has already been sent to your email. Please check your inbox.");
    }


    const codeNumber = Math.floor(100000 + Math.random() * 900000).toString();

    const code: SecurityCode = {
        id: crypto.randomUUID(),
        user_id: secure.crypt(user.id),
        code: secure.crypt(codeNumber),
        purpose: purpose,
        created_at: new Date().getTime(),
        expires_at: new Date().getTime() + (10 * 60 * 1000), // 10 minutes from now
        used: false,
        used_at: null,
        associated_service: secure.crypt(service.id),
    }

    const dbRt = await db.collection('security_codes').insertOne(code);
    if (!dbRt.acknowledged) {
        return software.methods.serverReply(500, "Failed to store verification code.");
    }

    return software.methods.serverReply(200, `Verification code for ${purpose} created successfully.`, { code: codeNumber });
}