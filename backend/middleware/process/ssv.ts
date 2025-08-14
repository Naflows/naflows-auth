import { db } from "../..";
import { ReplyType } from "../../types/.types/reply.type";
import { Tokens, User, UserSession } from "../../types/.types/collections.type";
import UCRType from "../../types/.types/ucr.type";
import secure from "../../secure/dir";
import middleware from "../dir";
import { Collection } from "mongoose";
import { software } from "../../software/dir";

// For evident reasons, there are no environment variables to enable / disable the SSV process.

export async function ssv(req: Request, res: Response): Promise<ReplyType> {
  const ucr = req.body as unknown as UCRType;

  /*
        1. Check user's informations
        2. Check if the session exists.
        3. Check if the session is valid.
        4. Check if the session is not expired.
        5. Check the session's token.
    
    */

  // STEP 1
  const sessionsCollection = db.collection("sessions") as Collection<UserSession>;
  const tokensCollection = db.collection("tokens") as Collection<Tokens>;
  const usersCollection = db.collection("users");

  if (sessionsCollection && tokensCollection && usersCollection) {

    const user = (await usersCollection.findOne({
      id: secure.hash(ucr.user.user_id),
    })) as unknown as User;
    
    const session = await sessionsCollection.findOne({
      id: secure.hash(ucr.user.session_id),
    }) as unknown as UserSession;
    if (user != undefined) {
      if (session) {

        const allInformationsCorrect =
          session.ip === ucr.user.ip &&
          session.device_fingerprint === ucr.user.device_fingerprint &&
          session.user_origin == ucr.user.user_origin &&
          session.agent === ucr.user.agent &&
          session.user_id == secure.hash(ucr.user.user_id);
        if (allInformationsCorrect) {
          const isOutdated = session.expires_at < Date.now();
          if (!isOutdated) {
            if (
              ucr.user.password != undefined &&
              ucr.user.identifier != undefined &&
              ucr.user.token == undefined
            ) {
              const isPasswordCorrect = secure.verify(
                ucr.user.password,
                user.password
              );

              const isIdentifierCorrect = secure.verify(
                ucr.user.identifier,
                user.identifier
              );

              if (!isPasswordCorrect || !isIdentifierCorrect) {
                return software.methods.serverReply(
                  401,
                  "Invalid user credentials.",
                );
              }
            } else if (ucr.user.token != undefined && ucr.user.token != null) {
              console.log(
                "\x1b[32m%s\x1b[0m",
                `Token provided: ${ucr.user.token} for tokenID ${session.token_id} and session ID ${session.id}`
              );
              const token = await tokensCollection.findOne({
                // `session` is already queried from the database, so its ID and the token ID are already hashed.
                id: session.token_id,
                session_id: session.id,
                user_id : user.id
              });


              if (!token || (token && ucr.user.token && !secure.verify(ucr.user.token, token.token))) {
                console.error(
                  "\x1b[31m%s\x1b[0m",
                  "Invalid token provided for user session."
                );
                return software.methods.serverReply(
                  401,
                  "Invalid user credentials.",
                );
              }
            } else {
              console.error(
                "\x1b[31m%s\x1b[0m",
                "CRITICAL NASS ISSUE: UCR validation may be disabled, which is leading to a security risk. Please check your configuration."
              );
              return software.methods.serverReply(500, "Internal server error. UCR should be valid but no credentials found.");
            }
          } else {
            const sessionRenewal: ReplyType = await middleware.session.renewal(ucr, { sessionsCollection: sessionsCollection, tokensCollection: tokensCollection }, user, session);

            if (!sessionRenewal.success) {
              return sessionRenewal;
            }
          }
        } else {
          return software.methods.serverReply(401, "Invalid session informations.");
        }
      } else {
        return software.methods.serverReply(401, "Session not found.");
      }
    } else {
      return software.methods.serverReply(401, "Unknown user credentials.");
    }


    const newSessionID: ReplyType = await secure.session.renew(session.id, { sessionsCollection: sessionsCollection, tokensCollection: tokensCollection });

    if (!newSessionID.success) {
      return newSessionID;
    }


    return software.methods.serverReply(200, "SSV Process completed successfully.", {
      session: (newSessionID.data as { session?: string }).session || session.id
    });
  } else {
    return software.methods.serverReply(
      500,
      "Internal server error. Could not access the database collections.",
    );
  }



}
