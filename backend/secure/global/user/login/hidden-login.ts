import middleware from "../../../../middleware/dir";
import { software } from "../../../../software/dir";
import { Tokens, User, UserSession } from "../../../../types/.types/collections.type";
import { ReplyType } from "../../../../types/.types/reply.type";
import secure from "../../dir";
import { Request, Response } from 'express';
import { acceptLogin } from "./modules/accept-login";
import notifications from "../../../../software/notifications/dir";




export async function hiddenLogin(req: Request, res: Response, preventMiddlewareReload: boolean): Promise<ReplyType> {

    // Verify all parameters: user, session, token 
    const tokenValue = req.body.user.token;
    const session_id = req.body.user.session_id;
    const uid = req.body.user.user_id;

    console.log("Hidden Login Attempt:", { tokenValue, session_id, uid });
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

    const user: User = await secure.user.get(uid, false);

    if (!user) {
        return software.methods.serverReply(401, "Unauthorized: User not found.");
    }

    const tokenValid = await secure.token.valid(token, session, user.id, true); // TODO : MAKE SURE CREDENTIALS ARE VALID
    if (!secure.session.valid(token, session, user.id).success || !tokenValid.success) {
        return software.methods.serverReply(401, "Invalid token or session.");
    }


    return (await acceptLogin(user, session, preventMiddlewareReload));
}