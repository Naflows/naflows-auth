import { db } from "../..";
import { TokenRights, Tokens, User, UserSession } from "../../types/.types/collections.type";
import { ReplyType } from "../../types/.types/reply.type";
import * as crypto from "crypto";

export async function createToken(
    user : User, 
    session : UserSession,
    rights : TokenRights,
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
            expires_at: Date.now() + (renewable ? 0 : parseInt(process.env.SESSION_TOKEN_DURATION || "3600000")), // Default to 1 hour if not set
            renewable: renewable,
            uses: 0,
            max_uses: max_uses || 1, // Default to 1 use if not specified
            rights: [rights],
        };

        // Save the token to the database
        const tokensCollection = db.collection("tokens");
        await tokensCollection.insertOne(token);

        return {
            status: 201,
            message: "Token created successfully.",
            success: true,
            data: {
                token : token.token
            }
        };
    } catch (error) {
        return {
            status: 500,
            message: "An error occurred while creating the token: " + error.message,
            success: false,
        };
    }
}