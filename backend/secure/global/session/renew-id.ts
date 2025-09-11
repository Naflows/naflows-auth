import { Collection } from "mongoose";
import { Tokens, UserSession } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import { software } from "../../../software/dir";
import secure from "../dir";
import crypto from "crypto";

export default async function renewSessionId(sessionID : string, collections : {
    sessionsCollection: Collection<UserSession>,
    tokensCollection: Collection<Tokens>, 
}) : Promise<ReplyType> {
    console.log("Renewing session ID for session:", sessionID);
    const session = await secure.session.get(sessionID);
    if (!session) {
        console.error("\x1b[31m%s\x1b[0m", "Session not found at renew-id.");
        return software.methods.serverReply(404,"Session not found.");
    } 

    const token = await collections.tokensCollection.findOne({ session_id: secure.hash(session.id) }) as Tokens;
    const renewalToken = await collections.tokensCollection.findOne({
        user_id: secure.hash(session.user_id),
        session_id: secure.hash(session.id),
        rights: "TOKEN_RENEWAL"
    }) as Tokens;

    if (!token) {
        return software.methods.serverReply(404, "No token associated with this session.");
    }

    const newSessionID = crypto.randomUUID(); // Generate a new session ID
    const newSessionIDHash = secure.hash(newSessionID);
    const updatedSession: UserSession = {
        ...session,
        id: newSessionID,
        expires_at: Date.now() + (process.env.SESSION_LIFESPAN ? parseInt(process.env.SESSION_LIFESPAN) : 3600000),
        last_activity: Date.now()
    };


    
    const updateToken = await collections.tokensCollection.updateMany(
        { session_id: secure.hash(session.id) },
        { $set: { session_id: newSessionIDHash, updated_at: Date.now() } }
    );
    if (renewalToken) {
        await collections.tokensCollection.updateOne(
            { id: renewalToken.id },
            { $set: { session_id: newSessionIDHash, updated_at: Date.now() } }
        );
    }
    const updateResult = await collections.sessionsCollection.updateOne(
        { id: sessionID },
        { $set: updatedSession }
    );


    if (updateResult.modifiedCount === 0 || updateToken.modifiedCount === 0) {
        console.error("Precisely one of the two updates failed: ", { session : updatedSession, token : token });
        return software.methods.serverReply(500, "Failed to renew the session.");
    }

    return software.methods.serverReply(200, "Session renewed successfully with code 200.", {
        session: newSessionID
    });
}
