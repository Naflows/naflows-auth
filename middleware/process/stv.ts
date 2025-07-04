import { Collection } from "mongoose";
import { db } from "../..";
import secure from "../../secure/dir";
import { Tokens, User, UserSession } from "../../types/.types/collections.type";
import { ReplyType } from "../../types/.types/reply.type";
import UCRType from "../../types/.types/ucr.type";
import middleware from "../dir";


export async function stv(req: Request, res: Response, ssv: ReplyType): Promise<ReplyType> {
    const sessionsCollection = db.collection("sessions") as Collection<UserSession>;
    const tokensCollection = db.collection("tokens") as Collection<Tokens>;
    const usersCollection = db.collection("users") as Collection<User>;
    const ucr = req.body as unknown as UCRType;

    
    console.log("\x1b[34m%s\x1b[0m", "------ STV Process started ------");
    console.log("\x1b[34m%s\x1b[0m", `SSV Data: ${JSON.stringify(ssv)}`);
    console.log("\x1b[34m%s\x1b[0m", `UCR Data: ${JSON.stringify(ucr)}`);

    if (sessionsCollection && tokensCollection && usersCollection) {
        // This means a new session has been issued. So, a new token must be created.
        if (ssv && ssv.data && ssv.status === 201) {
            const tokenRenewal: ReplyType = await middleware.token.renewal(req, res, ssv, { sessions: sessionsCollection, tokens: tokensCollection, users: usersCollection });
            if (tokenRenewal.success) {
                console.log("\x1b[32m%s\x1b[0m", "New session token created successfully.");
                ucr.user.token = (tokenRenewal.data as any).token || "";
            } else {
                console.error("\x1b[31m%s\x1b[0m", "Failed to create new session token:", tokenRenewal.message);
            }
            return tokenRenewal;
        }



        // Then, if there are no renewal / renewal has been done correctly, we check if the token is valid for session | check if identifiers are valid

        // If the session is valid, we check if the token is not frozen
        const sessionID = ucr.user.session_id;
        const session = await sessionsCollection.findOne({ id: sessionID }) as unknown as UserSession;
        console.log("\x1b[34m%s\x1b[0m", `Session ID: ${sessionID}`);
        console.log("\x1b[34m%s\x1b[0m", `Given token: ${ucr.user.token}`);
        if (session) {
            const tokenID = session.token_id;
            const token = await tokensCollection.findOne({ id: tokenID }) as unknown as Tokens;

            console.log("\x1b[34m%s\x1b[0m", `Token: ${JSON.stringify(token)}\nTime now: ${Date.now()}`);
            if (token && (token.token === ucr.user.token || (ucr.user.password && ucr.user.identifier))) {
                if (token.frozen_at + token.frozen_until > Date.now()) {
                    return {
                        status : 429,
                        success: false,
                        message: "Token is frozen.",
                        data: {
                            retry_after: (token.frozen_at + token.frozen_until) - Date.now()
                        }
                    }
                }
            } else {
                return {
                    status: 401,
                    success: false,
                    message: "Invalid token.",
                };
            }
        }

  

        } else {
            return {
                status: 500,
                success: false,
                message: "Internal server error: collections not found.",
            };
        }


        return {
            status: 200,
            success: true,
            message: "STV process completed successfully.",
        }
    }