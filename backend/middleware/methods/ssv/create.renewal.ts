import { Collection } from "mongoose";
import secure from "../../../secure/global/dir";
import { software } from "../../../software/dir";
import { Tokens, User, UserSession } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import UCRType from "../../../types/.types/ucr.type";
import { db } from "../../..";

export async function executeSessionRenewal(
  credentialsValidity: boolean,
  ucr: UCRType,
  user: User,
  session: UserSession
) {
  const tokensCollection = db.collection("tokens") as Collection<Tokens>;

  if (!credentialsValidity) {
    return software.methods.serverReply(401, "Invalid credentials provided.");
  } else {
    console.log("Session is outdated => deleting session and tokens and creating a new one.");
    // If the session is outdated, delete it and send a new token for renewal (if a token already exists, delete it)
    await tokensCollection.deleteMany({
      user_id: secure.hash(ucr.user.user_id),
      rights: ["SESSION_RENEWAL"],
    });

    const newToken: ReplyType = await secure.token.create(user, session, ["SESSION_RENEWAL"], false, process.env.SESSION_RENEWAL_TOKEN_DEFAULT_USES ? parseInt(process.env.SESSION_RENEWAL_TOKEN_DEFAULT_USES) : 1);

    if (
      !newToken.success ||
      !newToken.data ||
      (newToken.data && !(newToken.data as { token?: string }).token)
    ) {
      return software.methods.serverReply(500, newToken.message || "Failed to create a new session renewal token.");
    }


    return software.methods.serverReply(401, "Session is outdated.", {
      token: (newToken.data as { token?: string }).token,
      session: session.id
    });
  }
}