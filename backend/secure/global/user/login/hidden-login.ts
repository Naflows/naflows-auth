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
    
    const token : Tokens = await secure.token.get(req.body.token, false);
    const session : UserSession = await secure.session.get(req.body.session_id, false);
    const user : User = await secure.user.get(req.body.user_id, false);


    if (!token || !session || !user) {
        console.error("\x1b[31m%s\x1b[0m", 
            `The following were not found: ${!token ? "token" : ""} ${!session ? "session" : ""} ${!user ? "user" : ""}`
        );
        return software.methods.serverReply(401, "Invalid token, session or user.");
    }

    if (!secure.session.valid(token, session, req.body.user_id).success || !secure.token.valid(token, session, req.body.user_id).success) {
        return software.methods.serverReply(401, "Invalid token or session.");
    }

    return (await acceptLogin(user, session));
}