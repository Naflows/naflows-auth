import { db } from "../../..";
import { software } from "../../../software/dir";
import { Tokens, UserSession } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import UCRType from "../../../types/.types/ucr.type";
import secure from "../dir";

export function isTokenValid(
  token: Tokens,
  session: UserSession,
  user_id: string,
  credentialsValid : boolean = false
): ReplyType {
  if (token) {
    const sessionValid = token.session_id == secure.hash(session.id);
    const userValid = token.user_id == secure.hash(user_id);
    let tokenValid = token.expires_at > Date.now();
    const tokenUsesValid = token.uses < token.max_uses;

    if (!tokenValid && credentialsValid) {
      // If the token is expired but the user has provided valid credentials, extend the token's validity
      token.expires_at = Date.now() + (process.env.TOKEN_LIFESPAN ? parseInt(process.env.TOKEN_LIFESPAN) : 3600000);
      tokenValid = true;
      // TODO: In a real-world scenario, you would also want to update this change in the database.
    }

    if (sessionValid && userValid && tokenValid && tokenUsesValid) {
      return software.methods.serverReply(200, "Token is valid.");
    } else {
        console.log("\x1b[33m%s\x1b[0m", `Token validation failed:
        Session Valid: ${sessionValid}, User Valid: ${userValid}, Token Valid: ${tokenValid}, Token Uses Valid: ${tokenUsesValid}`);
        return software.methods.serverReply(401, "Token is outdated or invalid.");
    }
  } else {
    return software.methods.serverReply(404, "Token not found.");
  }
}
