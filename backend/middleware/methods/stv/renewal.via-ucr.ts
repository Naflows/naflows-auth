import { Collection, DeleteResult } from "mongoose";
import { TokenRights, Tokens, User, UserSession } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import UCRType from "../../../types/.types/ucr.type";
import { software } from "../../../software/dir";
import secure from "../../../secure/global/dir";
import middleware from "../../dir";
import { db } from "../../..";




export async function checkRenewalViaUCR(
    token: Tokens,
    ucr: UCRType,
    session: UserSession
): Promise<ReplyType> {

    const tokensCollection = db.collection('tokens') as Collection<Tokens>;
    const sessionsCollection = db.collection('user_sessions') as Collection<UserSession>;
    

    console.log("\x1b[33m%s\x1b[0m", "Token is expired or has reached its maximum uses. Attempting to renew via UCR...");
    const user: User = await secure.user.get(session.user_id, true);
    if (!user) {
        return software.methods.serverReply(
            404,
            "User not found."
        );
    }

    if (!token.enabled && ucr.data && ucr.data["renewal-token"]) {
        const rt = ucr.data["renewal-token"];
        const t = await tokensCollection.findOne({
            token: rt,
            rights: "TOKEN_RENEWAL"
        }) as unknown as Tokens;
        console.log(`Renewal token found: ${t ? t.id : "none"}`);
        if (!t) {
            return software.methods.serverReply(
                401,
                "Renewal token is invalid or not provided."
            );
        }
        const isTokenValid: ReplyType = await secure.token.valid(t, session, ucr.user.user_id);
        if (!isTokenValid.success) {
            return isTokenValid;
        }

        if (!secure.verify(ucr.user.password, user.password) || !secure.verify(ucr.user.identifier, user.identifier)) {
            return software.methods.serverReply(
                401,
                "Invalid credentials provided."
            );
        }

        // Delete the old token
        const changes: DeleteResult = await tokensCollection.deleteOne({ 
            session_id: secure.hash(session.id),
            user_id: secure.hash(user.id)
         });
        if (changes.deletedCount === 0) {
            return software.methods.serverReply(
                500,
                "Failed to delete the old token."
            );
        }

        const renewalToken = await tokensCollection.deleteOne({
            id : t.id,
        });
        if (!renewalToken) {
            return software.methods.serverReply(
                500,
                "Failed to delete the renewal token."
            );
        }

        const newToken: ReplyType = await secure.token.create(
            user, session, token.rights, false, token.max_uses
        );
        const sessionChange = await sessionsCollection.updateOne(
            { id: session.id },
            { $set: { token_id: secure.crypt((newToken.data as { token_id?: string })?.token_id) } }
        );

        if (!newToken.success) {
            return newToken;
        }



        return software.methods.serverReply(
            200, "Token renewed successfully.",
            {
                token: (newToken.data as { token?: string }).token
            }
        );
    } else {
        const tokenChange = await tokensCollection.updateOne(
            { id: token.id },
            { $set: { enabled: false } }
        );

        if (tokenChange.modifiedCount === 0) {
            return software.methods.serverReply(
                500,
                "Failed to disable the token."
            );
        }


        const renewalToken: ReplyType = await secure.token.create(user, session, ["TOKEN_RENEWAL"], false, 1);
        return software.methods.serverReply(
            401,
            "Token is expired or has reached its maximum uses. Please log in again.",
            {
                token: (renewalToken.data as { token?: string }).token
            }
        );
    }



}