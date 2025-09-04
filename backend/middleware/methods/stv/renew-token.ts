// A token is renewed when the NASS renews a session. This ensures that the user has a valid token for the new session and that the old token is not still valid.

import { Collection } from "mongoose";
import { TokenRights, Tokens, User, UserSession } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import secure from "../../../secure/global/dir";
import { software } from "../../../software/dir";



export default async function renewToken(req: Request, res: Response, ssv: ReplyType, collections: {
    sessions: Collection<UserSession>,
    tokens: Collection<Tokens>,
    users: Collection<User>
}): Promise<ReplyType> {
    if (ssv && ssv.data) {
        // Warning: ssv.data.session =/= req.data.newSessionID!
        const sessionID = (ssv.data as any).session;
        try {
            if (ssv.status === 201 && sessionID) {
                const newSession = await collections.sessions.findOne({
                    id: sessionID
                }) as unknown as UserSession;
                if (newSession) {
                    const currentToken = await collections.tokens.findOne({
                        id: newSession.token_id
                    }) as unknown as Tokens;
                    const user = await collections.users.findOne({
                        id: newSession.user_id
                    }) as unknown as User;
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
                                await collections.tokens.deleteOne({
                                    id: currentToken.id
                                });
                            }

                            // Update the session with the new token ID
                            await collections.sessions.updateOne(
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
                        }

                    }
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