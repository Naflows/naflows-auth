import { v4 } from "uuid";
import { db } from "../../..";
import { ReplyType } from "../../../types/.types/reply.type";
import { software } from "../../../software/dir";


export async function updateTokenUse(tokenId: string): Promise<ReplyType> {
    try {
        const tokensCollection = db.collection("tokens");
        const newValue = v4();
        const updateResult = await tokensCollection.updateOne(
            { id: tokenId },
            {
                $inc: { uses: 1 }, // Increment the use count
                $set: { updated_at: Date.now(), token: newValue } // Update the timestamp
            }
        );
        if (updateResult.modifiedCount === 0) {
            return software.methods.serverReply(404, "Token not found.", {
                success: false,
            });
        }
        return software.methods.serverReply(200, "Token use updated successfully.", {
            token: newValue,
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