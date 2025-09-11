import middleware from "../../../../middleware/dir";
import { software } from "../../../../software/dir";
import { Tokens, User, UserSession } from "../../../../types/.types/collections.type";
import { ReplyType } from "../../../../types/.types/reply.type";
import secure from "../../dir";
import { Request, Response } from 'express';
import { acceptLogin } from "./modules/accept-login";


export async function hiddenLogin(req : Request, res : Response) : Promise<ReplyType> {

    const serviceOk = await middleware.process.scv(req, res);

    if (!serviceOk) {
        return res.status(403).send("Unauthorized service access.");
    }

    // Verify all parameters: user, session, token 
    const tokenValue = req.body.user.token;
    const session_id = req.body.user.session_id;
    const uid = req.body.user.user_id;

    console.log("Hidden Login Attempt:", { tokenValue, session_id, uid });
    if (!tokenValue || !session_id || !uid) {
        return software.methods.serverReply(400, "Bad Request: Missing parameters.");
    }

    const token : Tokens = await secure.token.get(tokenValue, false);
    const session : UserSession = await secure.session.get(session_id, false);
    const user : User = await secure.user.get(uid, false);


    if (!token || !session || !user) {
        console.error("\x1b[31m%s\x1b[0m", 
            `The following were not found: ${!token ? "token" : ""} ${!session ? "session" : ""} ${!user ? "user" : ""}`
        );
        return software.methods.serverReply(401, "Invalid token, session or user.");
    }

    if (!secure.session.valid(token, session, user.id).success || !secure.token.valid(token, session, user.id).success) {
        return software.methods.serverReply(401, "Invalid token or session.");
    }

    return (await acceptLogin(user, session));
}