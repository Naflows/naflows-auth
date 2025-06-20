import { db } from "../../..";
import secure from "../../../secure/dir";
import { isTokenValid } from "../../../secure/user-token/token-valid";
import { Tokens, User, UserSession } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import UCRType from "../../../types/.types/ucr.type";
import * as crypto from "crypto";

export async function sessionRenewal(ucr: UCRType, collections: {
  sessionsCollection: any;
  tokensCollection: any;
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




    const updateResult = await collections.sessionsCollection.updateOne(
      { id: session.id },
      { $set: newSession }
    );

    if (updateResult.modifiedCount === 0) {
      return {
        status: 500,
        message: "Failed to renew the session.",
        success: false,
      };
    }

    return {
      status: 200,
      message: "Session renewed successfully.",
      success: true,
      data: {
        session: newSession.id,
        token: token.token, // Return the same token for further renewals
      },
    }



  } else {
    if (!credentialsValidity) {
      return {
        status: 401,
        message: "Invalid credentials provided.",
        success: false,
      };
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
        return {
          status: 500,
          message: newToken.message,
          success: false,
        };
      }



      return {
        status: 401,
        message: "Session is outdated.",
        success: false,
        data: {
          token: (newToken.data as { token?: string }).token,
        }
      };
    }
  }

}
