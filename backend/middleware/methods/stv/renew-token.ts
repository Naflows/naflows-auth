// A token is renewed when the NASS renews a session. This ensures that the user has a valid token for the new session and that the old token is not still valid.

import { Collection } from "mongoose";
import { TokenRights, Tokens, User, UserSession } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import secure from "../../../secure/global/dir";
import { software } from "../../../software/dir";
import { db } from "../../..";



export default async function renewToken(req: Request, ssv: ReplyType): Promise<ReplyType> {
    const sessions = db.collection("sessions") as Collection<UserSession>;
    const tokens = db.collection("tokens") as Collection<Tokens>;


    if (ssv && ssv.data) {
        console.log(">> Starting token renewal process...");
        console.log(">> SSV Data:", JSON.stringify(ssv.data, null, 2));
        // Warning: ssv.data.session =/= req.data.newSessionID!
        const newSessionID = ssv.data ? (ssv.data.session as unknown as string) : undefined;
        console.log(`>> Renewing token for session ID: ${newSessionID ? newSessionID : "unknown"}`);
        const newSession = newSessionID ? await secure.session.get(newSessionID) : undefined;
        try {
            if (ssv.status === 201 && newSession) {
                const currentToken = await tokens.findOne({
                    id: newSession.token_id
                }) as unknown as Tokens;
                // Warning : currentToken can be undefined if the session was just created (code 201 means session just created)
                // Delete the old token if it exists
                if (currentToken) {
                    await tokens.deleteOne({
                        id: currentToken.id
                    });
                }

                const user = await secure.user.get(newSession.user_id, true);

                if (!user) {
                    return software.methods.serverReply(
                        404,
                        "User not found for token renewal."
                    );
                }
                console.log(`>> Creating new token for user ${JSON.stringify(user)} and session ${JSON.stringify(newSession)}`);
                const newToken: ReplyType = await secure.token.create(
                    user,
                    newSession,
                    [], // Rights are deprecated here
                    true,
                    parseInt(process.env.STV_MAXIMAL_USE_RATES) // Default to 1 use if not specified
                );
                if (newToken.success) {
                    // Update the session with the new token ID
                    await sessions.updateOne(
                        { id: newSession.id },
                        { $set: { token_id: secure.hash((newToken.data as any).token_id) } }
                    );

                    return software.methods.serverReply(
                        200,
                        "New session token created successfully.",
                        {
                            token_id: newToken.data.token_id || "",
                            token : newToken.data.token || ""
                        }
                    );
                } else {
                    return software.methods.serverReply(
                        500,
                        "Failed to create new token: " + newToken.message
                    );
                }
            }
        } catch (error) {
            return software.methods.serverReply(
                500,
                "An error occurred while renewing the token: " + error.message
            );
        }
    } else {
        return software.methods.serverReply(
            200,
            "No session renewal required, no data provided."
        );
    }
}