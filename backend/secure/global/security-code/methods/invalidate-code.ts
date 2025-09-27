import { db } from "../../../..";
import { software } from "../../../../software/dir";
import { ReplyType } from "../../../../types/.types/reply.type";
import secure from "../../dir";


export async function invalidateSecurityCode(codeID: string) : Promise<ReplyType> {
    const code = await secure.code.get(codeID, null);
    if (!code) {
        return software.methods.serverReply(404, "Security code not found.");
    }

    code.used = true;
    code.used_at = new Date().getTime();

    const codeCollection = await db.collection('security_codes');
    const result = await codeCollection.updateOne({ id: codeID }, { $set: code });
    if (result.modifiedCount === 0) {
        return software.methods.serverReply(500, "Failed to invalidate security code.");
    }

    return software.methods.serverReply(200, "Security code invalidated successfully.");
}