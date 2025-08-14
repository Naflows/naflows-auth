import { v4 } from "uuid";
import { db } from "../../..";
import { ReplyType } from "../../../types/.types/reply.type";
import { software } from "../../../software/dir";
import { Collection } from "mongoose";
import { Tokens } from "../../../types/.types/collections.type";
import secure from "../../dir";
import * as crypto from "crypto";


export async function updateTokenUse(tokenId: string): Promise<ReplyType> {
    try {
        const tokensCollection = db.collection("tokens") as Collection<Tokens>;
        const newValue = crypto.randomUUID();


        const MIN = parseInt(process.env.STV_MINIMAL_TIMEOUT_MIN);
        const MAX = parseInt(process.env.STV_MINIMAL_TIMEOUT_MAX);
        if (isNaN(MIN) || isNaN(MAX) || MIN < 0 || MAX < 0 || MIN > MAX) {
            return software.methods.serverReply(500, "Invalid timeout configuration.", {
                success: false,
            });
        }

        const timeout = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
        const ts = timeout * 1000;


        const token = await tokensCollection.findOne({ id: tokenId }) as Tokens;

        if (!token) {
            return software.methods.serverReply(404, "Token not found.", {
                success: false,
            });
        }

        console.log(`Renewing token ${tokenId} => ${newValue} with session ID ${token.session_id} and user ID ${token.user_id} with timeout ${timeout} seconds.`);


        const updateResult = await tokensCollection.updateOne(
            { id: tokenId },
            {
                $inc: { uses: 1 }, // Increment the use count
                $set: { updated_at: Date.now(), token: secure.crypt(newValue), frozen_at: Date.now(), frozen_until: ts} // Update the timestamp
            }
        );

        if (updateResult.modifiedCount === 0) {
            return software.methods.serverReply(404, "Token not found.", {
                success: false,
            });
        }
        return software.methods.serverReply(200, "Token use updated successfully.", {
            token: newValue,
            retry_after : ts,
        });
    } catch (error) {
        return software.methods.serverReply(
            500,
            "An error occurred while updating the token use: " + (error as Error).message,
            {
                success: false,
            }
        );
    }
}

