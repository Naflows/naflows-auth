import { db } from "../../..";
import { software } from "../../../software/dir";
import { Tokens, UserSession } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import UCRType from "../../../types/.types/ucr.type";

export function isTokenValid(
  token: Tokens,
  ucr: UCRType,
  session: UserSession
): ReplyType {
  if (token) {
    const sessionValid = token.session_id == session.id;
    const userValid = token.user_id == ucr.user.user_id;
    const tokenValid = token.expires_at > Date.now();
    const tokenUsesValid = token.uses < token.max_uses;

    if (sessionValid && userValid && tokenValid && tokenUsesValid) {
      return software.methods.serverReply(200, "Token is valid.");
    } else {
        return software.methods.serverReply(401, "Token is outdated or invalid.");
    }
  } else {
    return software.methods.serverReply(404, "Token not found.");
  }
}
