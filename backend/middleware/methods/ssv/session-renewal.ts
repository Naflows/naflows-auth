import { Collection } from "mongoose";
import { db } from "../../..";
import secure from "../../../secure/global/dir";
import { isTokenValid } from "../../../secure/global/token/token-valid";
import { software } from "../../../software/dir";
import { Tokens, User, UserSession } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import UCRType from "../../../types/.types/ucr.type";
import * as crypto from "crypto";
import { executeSessionRenewal } from "./create.renewal";


export async function sessionRenewal(ucr: UCRType, user: User, session: UserSession): Promise<ReplyType> {
  const sessionsCollection = db.collection("sessions") as Collection<UserSession>;
  const tokensCollection = db.collection("tokens") as Collection<Tokens>;


  console.log(`Trying to renew session ${JSON.stringify(session)} for user ${JSON.stringify(user)} with UCR ${JSON.stringify(ucr)}`);
  const renewalToken = ucr.data ? ucr.data["session-renewal-token"] : undefined;
  let token: Tokens | undefined = undefined;
  if (renewalToken) {
    token = await secure.token.getByValue(renewalToken);
    console.log("Found renewal token: " + JSON.stringify(token));
  }

  const credentialsValidity = secure.verify(ucr.user.password, user.password) && secure.verify(ucr.user.identifier, user.identifier)

  const isTokenValid = await secure.token.valid(token, session, ucr.user.user_id, secure.verify(ucr.user.password, user.password) && secure.verify(ucr.user.identifier, user.identifier));


  if (
    token && token.rights.includes("SESSION_RENEWAL") &&
    isTokenValid.success &&
    credentialsValidity
  ) {
    // If there is a renewal token and it is valid, renew the session and the attached token with a new value

    const newSession: UserSession = {
      ...session,
      id: crypto.randomUUID(),
      last_activity: Date.now(),
      expires_at: Date.now() + (
        process.env.SESSION_RENEWAL_LIFESPAN ? parseInt(process.env.SESSION_RENEWAL_LIFESPAN) : 3600000 // Default to 1 hour
      ),
      user_id : secure.hash(user.id),
    };




    const updateToken = await tokensCollection.updateMany(
      { id: token.id },
      { $set: { session_id: secure.hash(newSession.id), updated_at: Date.now() } }
    )
    console.log("Update token result:", updateToken);
    const updateResult = await sessionsCollection.updateOne(
      { id: session.id },
      { $set: newSession }
    );





    if (updateResult.modifiedCount === 0 || updateToken.modifiedCount === 0) {
      return software.methods.serverReply(500, "Failed to renew the session.");
    }

    await tokensCollection.deleteMany({
      user_id: ucr.user.user_id,
      rights: ["SESSION_RENEWAL"],
    });


    return software.methods.serverReply(201, "Session renewed successfully with code 201.", {
      session: newSession
    });




  } else {
    console.log("Session renewal failed due to invalid token or credentials.");
    return (await executeSessionRenewal(credentialsValidity, ucr, user, session));
  }

}
