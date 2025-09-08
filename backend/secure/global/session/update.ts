import { db } from "../../..";
import { software } from "../../../software/dir";
import { UserSession } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";


export async function updateSession(sessionID : string, session : UserSession) : Promise<ReplyType> {
    const sessions = db.collection("sessions");
    const result = await sessions.updateOne({ id: sessionID }, { $set: session });
    if (result.modifiedCount === 0) {
        console.error("\x1b[31m%s\x1b[0m", "Session not found at update.");
        return software.methods.serverReply(404, "Session not found.");
    }
    return software.methods.serverReply(200, "Session updated successfully");
}