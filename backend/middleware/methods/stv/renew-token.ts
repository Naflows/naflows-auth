// A token is renewed when the NASS renews a session. This ensures that the user has a valid token for the new session and that the old token is not still valid.

import { Collection } from "mongoose";
import { TokenRights, Tokens, User, UserSession } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import secure from "../../../secure/global/dir";
import { software } from "../../../software/dir";
import { db } from "../../..";



export default async function renewToken(ssv: ReplyType): Promise<ReplyType> {
    const sessions = db.collection("sessions") as Collection<UserSession>;
    const tokens = db.collection("tokens") as Collection<Tokens>;


    if (ssv && ssv.data) {
        // Warning: ssv.data.session =/= req.data.newSessionID!
        const sessionID = (ssv.data as any).session;
        try {
            if (ssv.status === 201 && sessionID) {
                const newSession = await secure.session.get(sessionID);
                if (newSession) {
                    const currentToken = await tokens.findOne({
                        id: newSession.token_id
                    }) as unknown as Tokens;
                    const user = await secure.user.get(newSession.user_id, true);
                    if (currentToken) {
                        const newToken: ReplyType = await secure.token.create(
                            user,
                            newSession,
                            currentToken.rights,
                            currentToken.renewable,
                            currentToken.max_uses || 1 // Default to 1 use if not specified
                        );
                        if (newToken.success) {
                            // Delete the old token if it exists
                            if (currentToken.id) {
                                await tokens.deleteOne({
                                    id: currentToken.id
                                });
                            }

                            // Update the session with the new token ID
                            await sessions.updateOne(
                                { id: newSession.id },
                                { $set: { token_id: secure.hash((newToken.data as any).token_id) } }
                            );

                            return software.methods.serverReply(
                                200,
                                "New session token created successfully.",
                                {
                                    token: (newToken.data as any).token || ""
                                }
                            );
                        } else {
                            return software.methods.serverReply(
                                500,
                                "Failed to create new token: " + newToken.message
                            );
                        }
                    } else {
                        return software.methods.serverReply(
                            404,
                            "Current token not found for the session."
                        );
                    }
                } else {
                    return software.methods.serverReply(
                        404,
                        "Session not found for token renewal."
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