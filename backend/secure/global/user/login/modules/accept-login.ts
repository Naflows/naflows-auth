import { db } from "../../../../..";
import { software } from "../../../../../software/dir";
import { User, UserSession } from "../../../../../types/.types/collections.type";
import { ReplyType } from "../../../../../types/.types/reply.type";
import secure from "../../../dir";



export async function acceptLogin(
    _user: User, associatedSession: UserSession
) {
    const token = await secure.token.get(associatedSession.token_id, true);

    if (!token) {
        return software.methods.serverReply(500, "Token associated with the session not found.");
    }

    const newSessionID: ReplyType = await secure.session.renew(associatedSession.id, {
        sessionsCollection: db.collection("sessions"),
        tokensCollection: db.collection("tokens")
    });

    if (!newSessionID.success || !(newSessionID.data as any)?.session) return software.methods.serverReply(500, "Failed to renew session.");

    const newTokenID: ReplyType = await secure.token.renew(
        token.id,
        _user.id,
        (newSessionID.data as any)?.session
    );

    if (!newTokenID.success || !(newTokenID.data as any)?.token) return software.methods.serverReply(newTokenID.status, newTokenID.message);

    // Update user informations
    _user.last_login = new Date().getTime();
    _user.last_update = new Date().getTime();
    const updateUserResult: ReplyType = await secure.user.update(_user.id, _user);
    if (!updateUserResult.success) {
        console.error("\x1b[31m%s\x1b[0m", "Failed to update user last login time after accepting login.");
    }


    return software.methods.serverReply(200, "Login successful", {
        session: (newSessionID.data as any)?.session,
        token: (newTokenID.data as any)?.token,
        user_id : _user.id,
    });
}