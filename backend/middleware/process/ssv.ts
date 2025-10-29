import { db } from "../..";
import { ReplyType } from "../../types/.types/reply.type";
import { Tokens, User, UserSession } from "../../types/.types/collections.type";
import UCRType from "../../types/.types/ucr.type";
import secure from "../../secure/global/dir";
import middleware from "../dir";
import { Collection } from "mongoose";
import { software } from "../../software/dir";
import { executeSessionRenewal } from "../methods/ssv/create.renewal";

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
    let newSessionID: ReplyType;

    console.log("\x1b[33m%s\x1b[0m", "Starting SSV process...");
    console.log("Looking for user with ID:", ucr.user.user_id, "and session ID:", ucr.user.session_id);
    const user = (await usersCollection.findOne({
      id: ucr.user.user_id,
    })) as unknown as User;

    let session = await sessionsCollection.findOne({
      id: ucr.user.session_id
    }) as unknown as UserSession;

    if (ucr.data["session-renewal-token"]) {
      // Execute session renewal process
      console.log("Session renewal token found in UCR data - executing session renewal process.");
      const sessionRenewal: ReplyType = await middleware.session.renewal(ucr, user, session);

      if (!sessionRenewal.success) {
        return sessionRenewal;
      } else {
        console.log("\x1b[32m%s\x1b[0m", "Session renewed successfully during SSV process -- proceeding.");

        session.id = sessionRenewal.data.session.id || session.id;
        session.last_activity = Date.now();

        const sessionUpdate = await sessionsCollection.updateOne(
          { id: session.id },
          { $set: session }
        );

        if (!sessionUpdate) {
          return software.methods.serverReply(500, "Failed to update session after renewal.");
        }

        return sessionRenewal;
      }
    }


    if (user != undefined) {
      if (session) {
        console.log("Session found:", session);
        const allInformationsCorrect =
          session.ip === ucr.user.ip &&
          //session.device_fingerprint === ucr.user.device_fingerprint &&
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
              // Log all tokens
              const allTokens = await tokensCollection.find({ user_id: secure.hash(user.id) }).toArray() as unknown as Tokens[];
              console.log("All tokens for user:", allTokens);


              if (!token || (token && ucr.user.token && !secure.verify(ucr.user.token, token.token)) || token.user_id !== secure.hash(user.id) || !token.enabled) {
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
            const sessionRenewal: ReplyType = await middleware.session.renewal(ucr, user, session);

            if (!sessionRenewal.success) {
              return sessionRenewal;
            } else {
              console.log("\x1b[32m%s\x1b[0m", "Session renewed successfully during SSV process -- proceeding.");

              session.id = sessionRenewal.data.session.id || session.id;
              session.last_activity = Date.now();

              const sessionUpdate = await sessionsCollection.updateOne(
                { id: session.id },
                { $set: session }
              );

              if (!sessionUpdate) {
                return software.methods.serverReply(500, "Failed to update session after renewal.");
              }

            }
          }
        } else {
          return software.methods.serverReply(401, "Invalid session informations.");
        }
      } else {
        // If there is no session, check if the user provided valid credentials to create a new session

        if (
          ucr.user.password != undefined &&
          ucr.user.identifier != undefined &&
          secure.verify(ucr.user.password, user.password) &&
          secure.verify(ucr.user.identifier, user.identifier)
        ) {
          console.log("No session found, but valid credentials provided - creating new session.");
          // Create a new session
          const newSession: ReplyType = await secure.session.create(
            user,
            ucr.user.device_fingerprint,
            ucr.user.agent,
            ucr.user.ip,
            ucr.client.service,
          );
          if (!newSession.success || !newSession.data.session) {
            return newSession;
          } else {
            console.log("\x1b[32m%s\x1b[0m", "New session created successfully during SSV process -- proceeding.");
            session = newSession.data.session;
            const token: ReplyType = await executeSessionRenewal(true, ucr, user, session);
            // Error 401 is expected here to indicate that a new session has been created but has no token yet
            if (!token.success && token.status === 401) {
              return token;
            }
          }
        } else {
          return software.methods.serverReply(401, "Invalid user credentials.");
        }
      }
    } else {
      return software.methods.serverReply(401, "Unknown user credentials.");
    }


    newSessionID = await secure.session.renew(session.id, { sessionsCollection: sessionsCollection, tokensCollection: tokensCollection });

    if (!newSessionID.success) {
      return newSessionID;
    }


    return software.methods.serverReply(200, "SSV Process completed successfully.", {
      session: newSessionID.data.session.id || session.id
    });
  } else {
    return software.methods.serverReply(
      500,
      "Internal server error. Could not access the database collections.",
    );
  }



}
