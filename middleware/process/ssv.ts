import { db } from "../..";
import { ReplyType } from "../../types/.types/reply.type";
import { User } from "../../types/.types/collections.type";
import UCRType from "../../types/.types/ucr.type";
import secure from "../../secure/dir";

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
  const sessionsCollection = db.collection("sessions");
  const tokensCollection = db.collection("tokens");
  const usersCollection = db.collection("users");

  if (sessionsCollection && tokensCollection && usersCollection) {
    const user = await usersCollection.findOne({
      id: parseInt(ucr.user.user_id),
    }) as unknown as User;



    if (user != undefined) {
        const session = await sessionsCollection.findOne({
            id : parseInt(ucr.user.session_id)
        });
        if (session) {
            const allInformationsCorrect = session.ip === ucr.user.ip && session.device_fingerprint === ucr.user.device_fingerprint && session.user_origin == ucr.user.user_origin && session.agent === ucr.user.agent && session.user_id == parseInt(ucr.user.user_id);
            if (allInformationsCorrect) {
                const isOutdated = session.expires_at < Date.now();
                if (!isOutdated) {
                    if (ucr.user.password != undefined && ucr.user.identifier != undefined && ucr.user.token == undefined) {
                        const isPasswordCorrect = secure.verify(ucr.user.password, user.password);
                        const isIdentifierCorrect = secure.verify(ucr.user.identifier, user.identifier);

                        if (!isPasswordCorrect || !isIdentifierCorrect) {
                            return {
                                status: 401,
                                message: "Invalid user credentials.",
                                success: false,
                            };
                        } 
                    } else if (ucr.user.token != undefined && ucr.user.token != null) {
                      console.log(`Found token in UCR : ${ucr.user.token} <-> ${session.token_id !== undefined && session.token_id !== null ? session.token_id : "no token id"}`);
                      const token = await tokensCollection.findOne({
                            id : parseInt(session.token_id)
                        });

                        if (!token || token && token.token != ucr.user.token) {
                            return {
                                status: 401,
                                message: "Invalid user credentials.",
                                success: false,
                            };
                        } 
                    } else {
                        console.error("\x1b[31m%s\x1b[0m", "CRITICAL NASS ISSUE: UCR validation may be disabled, which is leading to a security risk. Please check your configuration.");
                        return {
                            status : 500,
                            message: "Internal server error. UCR should be valid but no credentials found.",
                            success : false
                        }
                    }
                } else {
                    return {
                        status : 401,
                        message : "Session is outdated.",
                        success : false
                    }
                }

            } else {
                return {
                    status : 401,
                    message : "Invalid session informations.",
                    success : false
                }
            }

        } else {
            return {
                status: 401,
                message: "Session not found.",
                success: false,
            };
        }
    } else {
      return {
        status: 401,
        message: "Unknown user credentials.",
        success: false,
      };
    }
  } else {
    return {
      status: 500,
      message: `Internal server error. Could not access the database collections (${
        sessionsCollection ? "" : "sessions"
      } ${tokensCollection ? "" : "tokens"} ${
        usersCollection ? "" : "users"
      }).`,
      success: false,
    };
  }

  return {
    status: 200,
    message: "SSV Process completed successfully.",
    success: true,
  };
}
