import { software } from "../../../software/dir";
import { Tokens, UserSession } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import secure from "../dir";



export async function isSessionValid(token: Tokens,session : UserSession, user_id: string) : ReplyType {
    const tokenValid = token.id == secure.hash(session.id);
    const userValid = token.user_id == secure.hash(user_id);
    const sessionValid = session.expires_at > Date.now();
    const sessionActive = session.active;
    
    if (tokenValid && userValid && sessionValid && sessionActive) {
        return software.methods.serverReply(200, "Session is valid.", true);
    } else {
        console.log("\x1b[33m%s\x1b[0m", `Session validation failed:
        Token Valid: ${tokenValid}, User Valid: ${userValid}, Session Valid: ${sessionValid}, Session Active: ${sessionActive}`);
        return software.methods.serverReply(401, "Session is invalid or expired.", false);
    }



}