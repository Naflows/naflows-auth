import { db } from "../..";
import { Tokens, UserSession } from "../../types/.types/collections.type";
import { ReplyType } from "../../types/.types/reply.type";
import UCRType from "../../types/.types/ucr.type";

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
        return {
            status: 200,
            message: "Token is valid.",
            success: true,
        } 
    } else {
        return {
            status: 401,
            message: "Token is outdated or invalid.",
            success: false,
        }
    }
  } else {
    return {
      status: 404,
      message: "Token not found.",
      success: false,
    };
  }
}
