import { Collection } from "mongoose";
import { db } from "../..";
import secure from "../../secure/global/dir";
import { Tokens, User, UserSession } from "../../types/.types/collections.type";
import { ReplyType } from "../../types/.types/reply.type";
import UCRType from "../../types/.types/ucr.type";
import middleware from "../dir";
import { software } from "../../software/dir";
import { services } from "../../secure/services/dir";


export async function stv(req: Request, res: Response, ssv: ReplyType): Promise<ReplyType> {
    const sessionsCollection = db.collection("sessions") as Collection<UserSession>;
    const tokensCollection = db.collection("tokens") as Collection<Tokens>;
    const usersCollection = db.collection("users") as Collection<User>;
    const ucr = req.body as unknown as UCRType;



    if (process.env.NASS_STV_ENABLED === "true") {
        if (sessionsCollection && tokensCollection && usersCollection) {
            // This means a new session has been issued. So, a new token must be created.

            let tokenID: string = undefined;

            if (ssv && ssv.data && ssv.status === 201) {
                const tokenRenewal: ReplyType = await middleware.token.renewal(req, ssv);
                console.log("Token renewal result:", tokenRenewal);
                if (tokenRenewal.success) {
                    console.log("\x1b[32m%s\x1b[0m", "New session token created successfully : " + tokenRenewal.data.token_id);
                    tokenID = tokenRenewal.data.token_id;
                } else {
                    console.error("\x1b[31m%s\x1b[0m", "Failed to create new session token:", tokenRenewal.message);
                }
            }
            console.log("\x1b[33m%s\x1b[0m", "No new session issued, proceeding with existing session.");

            const sessionID = ssv.data ? (ssv.data.session as unknown as string) : ucr.user.session_id;
            console.log(`SessionID = ${sessionID} | ucr.user.session_id = ${ucr.user.session_id}`);
            console.log("All sessions:  ", await sessionsCollection.find({}).toArray());
            const session = await secure.session.get(sessionID, false);
            if (session) {
                // The token ID is queried directly FROM the session that has been recovered in the database, so its ID is already hashed.
                let token;
                if (!tokenID) {
                    tokenID = session.token_id;
                    token = await secure.token.get(tokenID, true);
                } else {
                    token = await secure.token.get(tokenID);
                }


                console.log(`TokenID = ${tokenID}`);
                console.log("Token found:", token);
                console.log("UCR User:", ucr.user);

                if (token && (
                    // Checks if the token is valid for the session
                    (ucr.user.token && secure.verify(ucr.user.token, token.token) && token.enabled) || (ucr.user.password && ucr.user.identifier))
                ) {

                    if (
                        token.uses >= token.max_uses || token.expires_at < Date.now()
                        || (!token.enabled && ucr.data && ucr.data["renewal-token"])
                    ) {
                        console.log(`Triggered because:\ntoken.uses: ${token.uses} >= token.max_uses: ${token.max_uses}\ntoken.expires_at: ${token.expires_at} < Date.now(): ${Date.now()}\ntoken.enabled: ${token.enabled} && ucr.data["renewal-token"]: ${!!ucr.data && !!ucr.data["renewal-token"]}`);
                        const renewalTokenValue = ucr.data ? ucr.data["renewal-token"] : undefined;

                        const isTokenNotExpired: ReplyType = await middleware.token.ucrRenewal(token, ucr, session);
                        return isTokenNotExpired;
                    }


                    if (token.frozen_at + token.frozen_until > Date.now()
                        && token.supertest
                    ) {
                        return software.methods.serverReply(
                            429,
                            "Token is frozen.",
                            {
                                retry_after: (token.frozen_at + token.frozen_until) - Date.now()
                            }
                        );
                    }

                    const checkRights = await middleware.token.rights(ucr);
                    if (!checkRights.success) {
                        return checkRights;
                    }



                    const t = await secure.token.updateUse(token.id);
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
                            token: (t.data as { token?: string }).token,
                            retry_after: (t.data as { retry_after?: number }).retry_after || 0,
                        }
                    );

                } else {
                    return software.methods.serverReply(
                        401,
                        "Invalid token or credentials provided.",
                    );
                }

            } else {
                console.error("\x1b[31m%s\x1b[0m", "Session not found in STV process.");
                return software.methods.serverReply(
                    404,
                    "Session not found.",
                );
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