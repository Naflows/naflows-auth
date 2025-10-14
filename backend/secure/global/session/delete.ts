import { Collection } from "mongoose";
import { db } from "../../..";
import { Tokens, UserSession } from "../../../types/.types/collections.type";
import secure from "../dir";
import { ReplyType } from "../../../types/.types/reply.type";
import { software } from "../../../software/dir";


async function deleteSession(sessionID: string): Promise<ReplyType> {
    const sessions : Collection<UserSession> = await db.collection("sessions");

    // Find the session in the database
    const session: UserSession = await secure.session.get(sessionID);
    if (!session) throw new Error("Session not found");

    const del = await sessions.deleteOne({ id: sessionID });
    if (!del.deletedCount) return software.methods.serverReply(404, "Session not found");
    return software.methods.serverReply(200, "Session deleted successfully");
}

export default deleteSession;