import { parse } from "path";
import { software } from "../../../software/dir";
import { Tokens, User, UserSession } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import secure from "../dir";


export async function confirmSession(tokenValue: string, tokenID: string): Promise<ReplyType> {

    const token: Tokens = await secure.token.get(tokenID);
    if (!token) return software.methods.serverReply(404, "Token not found");

    console.log(token);

    
    const associatedSession: UserSession = await secure.session.get(token.session_id, true);


    if (!associatedSession) {
        console.error("\x1b[31m%s\x1b[0m", "Session not found at confirmSession.");
        return software.methods.serverReply(404, "Session not found.");
    }


    const tokenValueIsValid = secure.verify(tokenValue, token.token);
    console.log(`Token value is valid: ${tokenValueIsValid}`);

    if (token.created_at + token.expires_at < Date.now()) {
        return software.methods.serverReply(401, "Token expired: please renew your connection to the service.");
    } else if (!tokenValueIsValid) {
        return software.methods.serverReply(403, "Token mismatch: the provided token does not match the stored token");
    } else if (!token.rights.includes("SESSION_CONFIRMATION")) {
        return software.methods.serverReply(403, "Insufficient rights: the token is missing the SESSION_CONFIRMATION right");
    } else if (associatedSession.active) {
        return software.methods.serverReply(200, "Session is already active.");
    }


    // Activate the session
    associatedSession.active = true;
    associatedSession.last_activity = Date.now();

    // Delete the current token
    const dT = await secure.token.delete(tokenID);
    if (!dT.success) return software.methods.serverReply(500, "Failed to delete the used token.");

   // Create a new token for this session
   const user : User = await secure.user.get(associatedSession.user_id, false);
    if (!user) return software.methods.serverReply(404, "User not found.");



   const newToken = await secure.token.create(user, associatedSession, ["USER_EDIT_OWN","USER_READ_OWN"],true,parseInt(process.env.STV_MAXIMAL_USE_RATES), null, parseInt(process.env.SESSION_TOKEN_DURATION));
   if (!newToken.success) return software.methods.serverReply(500, "Failed to create a new token.");

   // Associate the new token with the session
   associatedSession.token_id = (newToken.data as any).token_id;

   const uR : ReplyType = await secure.session.update(associatedSession.id, associatedSession);
    if (!uR.success) return software.methods.serverReply(500, "Failed to update session.");

    return software.methods.serverReply(200, "Session confirmed.");


}

export default confirmSession;