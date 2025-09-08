// A token is renewed when the NASS renews a session. This ensures that the user has a valid token for the new session and that the old token is not still valid.

import { Collection } from "mongoose";
import { TokenRights, Tokens, User, UserSession } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import secure from "../../../secure/global/dir";
import { software } from "../../../software/dir";
import { db } from "../../..";
import { v4 } from "uuid";



export default async function updateToken(
    tokenID: string, userID: string, sessionID: string,
): Promise<ReplyType> {
    const tokens = db.collection("tokens") as Collection<Tokens>;
    const users = db.collection("users") as Collection<User>;
    const sessions = db.collection("sessions") as Collection<UserSession>;

    const token = await secure.token.get(tokenID);
    if (!token) {
        return software.methods.serverReply(404, "Token not found, please renew session.");
    }

    if (token.session_id !== sessionID) {
        return software.methods.serverReply(403, "Token does not belong to this session.");
    }

    if (token.user_id !== userID) {
        return software.methods.serverReply(403, "Token does not belong to this user.");
    }

    const user = await users.findOne({ id: userID }) as User;
    if (!user) {
        return software.methods.serverReply(404, "User not found.");
    }

    const session = await sessions.findOne({ id: sessionID }) as UserSession;
    if (!session) {
        return software.methods.serverReply(404, "Session not found.");
    }

    const newTokenID = crypto.randomUUID();
    // Generate a random secure value for the token
    const tokenValue = crypto.randomUUID();
    const encryptedTokenValue = secure.crypt(tokenValue);
    const hashedTokenID  = secure.hash(tokenValue);

    // Update session
    const updateSession = await sessions.updateOne(
        { id: sessionID },
        { $set: { updated_at: Date.now(), token_id: newTokenID } }
    );

    // Update token
    const updateToken = await tokens.updateOne(
        { id: hashedTokenID },
        { $set: {
                id: newTokenID,
                token: encryptedTokenValue,
                session_id : sessionID,
        } }
    );

    if (updateSession.modifiedCount === 0 || updateToken.modifiedCount === 0) {
        return software.methods.serverReply(500, "Failed to renew token.");
    }

    return software.methods.serverReply(200, "Token renewed successfully.", {
        token: tokenValue
    });


}