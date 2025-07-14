import { Collection, DeleteResult } from "mongoose";
import { TokenRights, Tokens, User, UserSession } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import UCRType from "../../../types/.types/ucr.type";
import { software } from "../../../software/dir";
import secure from "../../../secure/dir";
import middleware from "../../dir";




export async function checkRenewalViaUCR(
    token: Tokens,
    ucr: UCRType,
    session: UserSession,
    collections: {
        sessionsCollection: Collection<UserSession>,
        tokensCollection: Collection<Tokens>,
        usersCollection: Collection<User>
    }
): Promise<ReplyType> {

    console.log("\x1b[33m%s\x1b[0m", "Token is expired or has reached its maximum uses. Attempting to renew via UCR...");
    const user: User = await collections.usersCollection.findOne({ id: session.user_id }) as unknown as User;
    if (!user) {
        return software.methods.serverReply(
            404,
            "User not found."
        );
    }

    if (!token.enabled && ucr.data && ucr.data["renewal-token"]) {
        const rt = ucr.data["renewal-token"];
        const t = await collections.tokensCollection.findOne({
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
        const isTokenValid: ReplyType = secure.token.valid(t, ucr, session);
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
        const changes: DeleteResult = await collections.tokensCollection.deleteOne({ 
            session_id: session.id,
            user_id: user.id
         });
        if (changes.deletedCount === 0) {
            return software.methods.serverReply(
                500,
                "Failed to delete the old token."
            );
        }

        const renewalToken = await collections.tokensCollection.deleteOne({
            id : t.id,
        });
        if (!renewalToken) {
            return software.methods.serverReply(
                500,
                "Failed to delete the old token."
            );
        }

        const newToken: ReplyType = await secure.token.create(
            user, session, token.rights, false, token.max_uses
        );
        const sessionChange = await collections.sessionsCollection.updateOne(
            { id: session.id },
            { $set: { token_id: (newToken.data as { token_id?: string })?.token_id } }
        );

        if (!newToken.success) {
            return newToken;
        }

        if (changes.deletedCount === 0) {
            return software.methods.serverReply(
                500,
                "Failed to delete the old token."
            );
        }

        return software.methods.serverReply(
            200, "Token renewed successfully.",
            {
                token: (newToken.data as { token?: string }).token
            }
        );
    } else {
        const tokenChange = await collections.tokensCollection.updateOne(
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