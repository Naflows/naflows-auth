// A token is renewed when the NASS renews a session. This ensures that the user has a valid token for the new session and that the old token is not still valid.

import { Collection } from "mongoose";
import { TokenRights, Tokens, User, UserSession } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import secure from "../../../secure/global/dir";
import { software } from "../../../software/dir";
import { db } from "../../..";
import crypto from "crypto";


export default async function updateToken(
    tokenID: string, userID: string, sessionID: string,
): Promise<ReplyType> {
    const tokens = db.collection("tokens") as Collection<Tokens>;
    const sessions = db.collection("sessions") as Collection<UserSession>;

    const token = await secure.token.get(tokenID, false);
    if (!token) {
        return software.methods.serverReply(404, "Token not found, please renew session.");
    }

    if (token.session_id !== secure.hash(sessionID)) {
        return software.methods.serverReply(403, "Token does not belong to this session.");
    }

    if (token.user_id !== secure.hash(userID)) {
        return software.methods.serverReply(403, "Token does not belong to this user.");
    }

    const user = await secure.user.get(userID, false);
    if (!user) {
        return software.methods.serverReply(404, "User not found.");
    }

    const session = await secure.session.get(sessionID, false);
    if (!session) {
        console.error("\x1b[31m%s\x1b[0m", "Session not found at renew-token.");
        return software.methods.serverReply(404, "Session not found.");
    }

    const newTokenID = crypto.randomUUID();
    // Generate a random secure value for the token
    const tokenValue = crypto.randomUUID();
    const encryptedTokenValue = secure.crypt(tokenValue);
    const hashedTokenID = secure.hash(tokenValue);

    // Update session
    const updateSession = await sessions.updateOne(
        { id: sessionID },
        { $set: { updated_at: Date.now(), token_id: hashedTokenID } }
    );

    // Update token
    const updateToken = await tokens.updateOne(
        { id: tokenID },
        {
            $set: {
                id: newTokenID,
                token: encryptedTokenValue,
                session_id: secure.hash(session.id),
            }
        }
    );



    if (updateSession.modifiedCount === 0 || updateToken.modifiedCount === 0) {
        console.error("Precisely one of the two updates failed: ", { session: session, token: token });
        return software.methods.serverReply(500, "Failed to renew token.");
    }

    return software.methods.serverReply(200, "Token renewed successfully.", {
        token: tokenValue
    });


}