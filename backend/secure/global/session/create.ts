import { v4 } from "uuid";
import { db } from "../../..";
import { Tokens, User } from "../../../types/.types/collections.type";
import secure from "../dir";
import { ReplyType } from "../../../types/.types/reply.type";
import { software } from "../../../software/dir";



export async function createSession(
    user: User,
    device_fingerprint: string,
    user_agent: string,
    ip : string,
    service_id: string,
) : Promise<ReplyType> {
    const sessions = db.collection('sessions');


    const session = {
        id : crypto.randomUUID(),
        user_id : user.id,
        created_at : new Date().getTime(),
        last_activity : new Date().getTime(),
        expires_at : process.env.SESSION_RENEWAL_LIFESPAN,
        token_id : "",
        ip : ip,
        agent : user_agent,
        service_id : service_id,
        active : false,
        device_fingerprint : device_fingerprint,
        user_origin : service_id,
    }

    const t = await sessions.insertOne(session);

    if (!t.acknowledged) {
        return software.methods.serverReply(500, "Failed to create session.");
    }

    return software.methods.serverReply(201, "Session created successfully.", session);
}

