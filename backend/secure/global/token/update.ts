import { db } from "../../..";
import { software } from "../../../software/dir";
import { Tokens } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import secure from "../dir";



export async function updateWholeToken(tokenID : string, token : Tokens) : Promise<ReplyType> {
    const t = await secure.token.get(tokenID,true);
    if (!t) {
        return software.methods.serverReply(404, "Token not found.");
    }

    const tokens = db.collection("tokens");
    const result = await tokens.updateOne({ id: t.id }, { $set: token });
    if (!result) {
        return software.methods.serverReply(500, "Failed to update token.");
    }

    return software.methods.serverReply(200, "Token updated successfully.");
}

