import { Collection } from "mongoose";
import { db } from "../../..";
import { Tokens } from "../../../types/.types/collections.type";
import secure from "../dir";
import { ReplyType } from "../../../types/.types/reply.type";
import { software } from "../../../software/dir";


async function deleteToken(tokenID: string): Promise<ReplyType> {
    const tokens : Collection<Tokens> = await db.collection("tokens");

    // Find the token in the database
    const token: Tokens = await secure.token.get(tokenID);
    if (!token) throw new Error("Token not found");

    const del = await tokens.deleteOne({ id: tokenID });
    if (!del.deletedCount) return software.methods.serverReply(404, "Token not found");
    return software.methods.serverReply(200, "Token deleted successfully");
}

export default deleteToken;