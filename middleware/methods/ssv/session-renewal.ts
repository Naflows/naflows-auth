import { Collection } from "mongoose";
import { db } from "../../..";
import secure from "../../../secure/dir";
import { isTokenValid } from "../../../secure/user-token/methods/token-valid";
import { software } from "../../../software/dir";
import { Tokens, User, UserSession } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import UCRType from "../../../types/.types/ucr.type";
import * as crypto from "crypto";

export async function sessionRenewal(ucr: UCRType, collections: {
  sessionsCollection: Collection<UserSession>;
  tokensCollection: Collection<Tokens>;
}, user: User, session: UserSession): Promise<ReplyType> {
  const renewalToken = ucr.data ? ucr.data["session-renewal-token"] : undefined;
  const token = renewalToken
    ? ((await collections.tokensCollection.findOne({
      token: renewalToken,
      rights: "SESSION_RENEWAL",
    })) as unknown as Tokens)
    : undefined;
  const credentialsValidity = secure.verify(ucr.user.password, user.password) &&
    secure.verify(ucr.user.identifier, user.identifier)
  if (
    token &&
    isTokenValid(token, ucr, session).success &&
    credentialsValidity
  ) {
    // If there is a renewal token and it is valid, renew the session and the attached token with a new value
    const newSession: UserSession = {
      ...session,
      expires_at: Date.now() + (
        process.env.SESSION_RENEWAL_LIFESPAN ? parseInt(process.env.SESSION_RENEWAL_LIFESPAN) : 3600000 // Default to 1 hour
      ),
    };

    console.log(`Renewing session ${session.id} with new session ID ${newSession.id} and user ID ${user.id}. Associated token is ${token.id} (${token.token}) with rights ${token.rights.join(", ")}.`);

    const updateToken = await collections.tokensCollection.updateOne(
      { id: session.token_id },
      { $set: { session_id: newSession.id, updated_at: Date.now() } }
    )
    const updateResult = await collections.sessionsCollection.updateOne(
      { id: session.id },
      { $set: newSession }
    );





    if (updateResult.modifiedCount === 0 || updateToken.modifiedCount === 0) {
      return software.methods.serverReply(500, "Failed to renew the session.");
    }

    await collections.tokensCollection.deleteMany({
      user_id: ucr.user.user_id,
      rights: "SESSION_RENEWAL",
    });


    return software.methods.serverReply(201, "Session renewed successfully with code 201.", {
      session: newSession.id,
    });




  } else {
    if (!credentialsValidity) {
      return software.methods.serverReply(401, "Invalid credentials provided.");
    } else {
      // If the session is outdated, delete it and send a new token for renewal (if a token already exists, delete it)
      await collections.tokensCollection.deleteMany({
        user_id: ucr.user.user_id,
        rights: "SESSION_RENEWAL",
      });

      const newToken: ReplyType = await secure.token.create(user, session, "SESSION_RENEWAL", false, process.env.SESSION_RENEWAL_TOKEN_DEFAULT_USES ? parseInt(process.env.SESSION_RENEWAL_TOKEN_DEFAULT_USES) : 1);

      if (
        !newToken.success ||
        !newToken.data ||
        (newToken.data && !(newToken.data as { token?: string }).token)
      ) {
        return software.methods.serverReply(500, newToken.message || "Failed to create a new session renewal token.");
      }


      return software.methods.serverReply(401, "Session is outdated.", {
        token: (newToken.data as { token?: string }).token,
      });
    }
  }

}
