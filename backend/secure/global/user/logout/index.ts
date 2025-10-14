import { software } from "../../../../software/dir";
import { Tokens, UserSession } from "../../../../types/.types/collections.type";
import { ReplyType } from "../../../../types/.types/reply.type";
import { Request, Response } from 'express';
import secure from "../../dir";



export async function logout(req : Request, res : Response) : Promise<ReplyType> {
    const tokenValue = req.body.user.token;
    const session_id = req.body.user.session_id;
    const uid = req.body.user.user_id;

    console.log("Logout Attempt:", { tokenValue, session_id, uid });
    if (!tokenValue || !session_id || !uid) {
        return software.methods.serverReply(400, "Bad Request: Missing parameters.");
    }

    const session: UserSession = await secure.session.get(session_id, false);
    if (!session) {
        return software.methods.serverReply(401, "Unauthorized: Session not found.");
    }

    const token: Tokens = await secure.token.get(session.token_id, true);

    if (!token) {
        return software.methods.serverReply(401, "Unauthorized: Token not found.");
    }

    // Delete session and token
    await secure.session.delete(session.id);
    await secure.token.delete(token.id);

    return software.methods.serverReply(200, "Logout successful.");

}