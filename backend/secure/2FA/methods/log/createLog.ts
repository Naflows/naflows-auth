import { Collection } from "mongoose";
import { db } from "../../../..";
import { User, UserSession } from "../../../../types/.types/collections.type";
import { ReplyType } from "../../../../types/.types/reply.type";
import TwoFALog from "../../../../types/.types/twoFA.type";
import crypto from "crypto";
import { software } from "../../../../software/dir";
import secure from "../../../global/dir";


export async function createTwoFALog(user: User, action: TwoFALog["action"], data?: { [key: string]: any }): Promise<ReplyType> {
    const collection = db.collection('2fa_logs') as Collection<TwoFALog>;


    const id = crypto.randomUUID();
    const cryptographic_token = crypto.randomBytes(32).toString('hex'); // 256-bit token
    const newLog: TwoFALog = {
        id: id,
        user_id: secure.crypt(user.id),
        state: "REQUEST_GENERATED",
        cryptographic_token: secure.crypt(cryptographic_token),
        action: action,
        data: data,
        created_at: Date.now(),
        used: {
            is_used: false
        },
        attempts: 0,
        code: "" // The actual 2FA code will be generated and stored securely elsewhere
    }


    const result = await collection.insertOne(newLog);
    if (!result.acknowledged) {
        return software.methods.serverReply(500, "Failed to create 2FA log.");
    }
    return software.methods.serverReply(201, "2FA log created successfully.", {
        userData: {
            log: {
                log_id: id,
                cryptographic_token: cryptographic_token
            }
        }
    });
}