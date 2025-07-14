import { Collection } from "mongoose";
import { db } from "../../..";
import { software } from "../../../software/dir";
import { TokenRights, Tokens, User, UserSession } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import * as crypto from "crypto";

export async function createToken(
    user : User, 
    session : UserSession,
    rights : TokenRights[],
    renewable : boolean,
    max_uses : number 
) : Promise<ReplyType> {

    try {
        const token: Tokens = {
            id: crypto.randomUUID(),
            token: crypto.randomUUID(), // Generate a secure random token
            user_id: user.id,
            session_id: session.id,
            created_at: Date.now(),
            expires_at: Date.now() + (parseInt(process.env.SESSION_TOKEN_DURATION || "3600000")), // Default to 1 hour if not set
            renewable: renewable,
            uses: 0,
            max_uses: max_uses || parseInt(process.env.STV_MAXIMAL_USE_RATES), // Default to 1 use if not specified
            rights: rights,
            enabled: true, // Token is enabled by default
            supertest : true,
        };

        // Save the token to the database
        const tokensCollection = db.collection("tokens") as Collection<Tokens>;
        await tokensCollection.insertOne(token);


        return software.methods.serverReply(
            201, "Token created successfully.", 
            {
            token: token.token,
            token_id: token.id,
        });
    } catch (error) {
        return software.methods.serverReply(
            500,
            "An error occurred while creating the token: " + (error as Error).message
        );
    }
}