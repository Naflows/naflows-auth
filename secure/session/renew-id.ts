import { Collection } from "mongoose";
import { UserSession } from "../../types/.types/collections.type";
import { ReplyType } from "../../types/.types/reply.type";
import { v4 } from "uuid";


export default async function renewSessionId(sessionID : string, collections : {
    sessionsCollection: Collection<UserSession>;
}) : Promise<ReplyType> {
    const session = await collections.sessionsCollection.findOne({ id: sessionID }) as UserSession;
    if (!session) {
        return {
            status: 404,
            success: false,
            message: "Session not found.",
        };
    } 

    const newSessionID = v4(); // Generate a new session ID
    const updatedSession: UserSession = {
        ...session,
        id: newSessionID,
        expires_at: Date.now() + (process.env.SESSION_LIFESPAN ? parseInt(process.env.SESSION_LIFESPAN) : 3600000) // Default to 1 hour
    };
    const updateResult = await collections.sessionsCollection.updateOne(
        { id: sessionID },
        { $set: updatedSession }
    );

    if (updateResult.modifiedCount === 0) {
        return {
            status: 500,
            message: "Failed to renew the session.",
            success: false,
        };
    }

    return {
        status: 200,
        message: "Session renewed successfully.",
        success: true,
        data: {
            session: updatedSession.id
        },
    };
}
