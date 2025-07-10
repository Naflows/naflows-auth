import { Collection } from "mongoose";
import { db } from "../..";
import secure from "../../secure/dir";
import { Tokens, User, UserSession } from "../../types/.types/collections.type";
import { ReplyType } from "../../types/.types/reply.type";
import UCRType from "../../types/.types/ucr.type";
import middleware from "../dir";
import { software } from "../../software/dir";


export async function stv(req: Request, res: Response, ssv: ReplyType): Promise<ReplyType> {
    const sessionsCollection = db.collection("sessions") as Collection<UserSession>;
    const tokensCollection = db.collection("tokens") as Collection<Tokens>;
    const usersCollection = db.collection("users") as Collection<User>;
    const ucr = req.body as unknown as UCRType;




    if (process.env.NASS_STV_ENABLED === "true") {
        if (sessionsCollection && tokensCollection && usersCollection) {
            // This means a new session has been issued. So, a new token must be created.
            if (ssv && ssv.data && ssv.status === 201) {
                const tokenRenewal: ReplyType = await middleware.token.renewal(req, res, ssv, { sessions: sessionsCollection, tokens: tokensCollection, users: usersCollection });
                if (tokenRenewal.success) {
                    console.log("\x1b[32m%s\x1b[0m", "New session token created successfully.");
                    return software.methods.serverReply(
                        200, "New session token created successfully.",
                        {
                            token: (tokenRenewal.data as { token?: string }).token
                        }
                    );
                } else {
                    console.error("\x1b[31m%s\x1b[0m", "Failed to create new session token:", tokenRenewal.message);
                }
                return tokenRenewal;
            } else {
                const sessionID = ucr.user.session_id;
                const session = await sessionsCollection.findOne({ id: sessionID }) as unknown as UserSession;
                if (session) {
                    const tokenID = session.token_id;
                    const token = await tokensCollection.findOne({ id: tokenID }) as unknown as Tokens;


                    // TODO: BRAINSTORM ABOUT IF ITS A GOOD IDEA TO HAVE EITHER TOKEN OR PASSWORD AND IDENTIFIER
                    if (token && (
                        // Checks if the token is valid for the session
                        token.token === ucr.user.token || (ucr.user.password && ucr.user.identifier))
                    ) {
                        if (token.frozen_at + token.frozen_until > Date.now() 
                            && token.id === "3"
                        ) {
                            return software.methods.serverReply(
                                429,
                                "Token is frozen.",
                                {
                                    retry_after: (token.frozen_at + token.frozen_until) - Date.now()
                                }
                            );
                        } else {
                            const t = await secure.token.updateUse(tokenID);
                            if (!t.success) {
                                return software.methods.serverReply(
                                    500,
                                    "Failed to update token use: " + t.message,
                                );
                            }
                            

                            return software.methods.serverReply(
                                200,
                                "STV Process completed successfully.",
                                {
                                    token: (t.data as { token?: string }).token
                                }
                            );
                        }
                    } else {
                        return software.methods.serverReply(
                            401,
                            "Invalid token or credentials provided.",
                        );
                    }

                } else {
                    return software.methods.serverReply(
                        404,
                        "Session not found.",
                    );
                }
            }
        } else {
            return software.methods.serverReply(
                500,
                "Internal server error: collections not found.",
            );
        }
    } else {
        console.log("\x1b[33m%s\x1b[0m", "NASS STV is disabled, skipping verification process.");
    }
}