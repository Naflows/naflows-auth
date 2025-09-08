import { db } from "../../..";
import { software } from "../../../software/dir";
import { Tokens, UserSession } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import UCRType from "../../../types/.types/ucr.type";
import secure from "../dir";

export function isTokenValid(
  token: Tokens,
  ucr: UCRType,
  session: UserSession
): ReplyType {
  if (token) {
    const sessionValid = token.session_id == secure.hash(session.id);
    const userValid = token.user_id == secure.hash(ucr.user.user_id);
    const tokenValid = token.expires_at > Date.now();
    const tokenUsesValid = token.uses < token.max_uses;

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
