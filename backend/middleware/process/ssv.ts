import { db } from "../..";
import { ReplyType } from "../../types/.types/reply.type";
import { Tokens, User, UserSession } from "../../types/.types/collections.type";
import UCRType from "../../types/.types/ucr.type";
import secure from "../../secure/global/dir";
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


    console.log("\x1b[33m%s\x1b[0m", "Starting SSV process...");
    console.log("Looking for user with ID:", ucr.user.user_id, "and session ID:", ucr.user.session_id);
    const user = (await usersCollection.findOne({
      id: ucr.user.user_id,
    })) as unknown as User;
    
    const session = await sessionsCollection.findOne({
      id: ucr.user.session_id
    }) as unknown as UserSession;
    if (user != undefined) {
      if (session) {
        const allInformationsCorrect =
          session.ip === ucr.user.ip &&
          session.device_fingerprint === ucr.user.device_fingerprint &&
          session.user_origin == ucr.user.user_origin &&
          session.agent === ucr.user.agent &&
          session.user_id == secure.hash(ucr.user.user_id);


        if (!session.active) {
          return software.methods.serverReply(401, "Session is not active - please log in again.");
        }

        if (session.service_id !== ucr.client.service && (session.supertest == null || session.supertest === false)
        ) {
          return software.methods.serverReply(401, "This session cannot be used with the current client.");
        }

        if (allInformationsCorrect) {
          const isOutdated = session.expires_at < new Date().getTime();
          console.log(`Session is ${isOutdated ? "outdated" : "valid"}`);
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

              const token = await secure.token.get(session.token_id, true);
              console.log(">>> ", token);
              


              if (!token || (token && ucr.user.token && !secure.verify(ucr.user.token, token.token)) || token.user_id !== secure.hash(user.id) || token.session_id !== secure.hash(ucr.user.session_id) || !token.enabled) {
                console.log(`Error details:
                Token exists: ${!!token}
                Token verification: ${token && ucr.user.token ? secure.verify(ucr.user.token, token.token) : "N/A"}
                Token user ID match: ${token ? token.user_id === secure.hash(user.id) : "N/A"}
                Token session ID match: ${token ? token.session_id === secure.hash(ucr.user.session_id) : "N/A"} (expected ${secure.hash(ucr.user.session_id)})
                Token enabled: ${token ? token.enabled : "N/A"}
                `);
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

            if (!sessionRenewal.success || !sessionRenewal.data || !(sessionRenewal.data as { session?: string }).session) {
              return sessionRenewal;
            } else {
              console.log("\x1b[32m%s\x1b[0m", "Session renewed successfully during SSV process -- proceeding.");
              
              session.id = (sessionRenewal.data as { session?: string }).session || session.id;
              session.last_activity = Date.now();



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
