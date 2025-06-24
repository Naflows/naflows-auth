import { db } from "../../..";
import { ReplyType } from "../../../types/.types/reply.type";


export async function updateTokenUse(tokenId: string): Promise<ReplyType> {
    try {
        const tokensCollection = db.collection("tokens");
        await tokensCollection.updateOne(
            { id : tokenId },
            {
                $inc: { uses: 1 }, // Increment the use count
                $set: { updated_at: Date.now() } // Update the timestamp
            }
        )
        return {
            status : 200,
            message : "Token use updated successfully.",
            success : true
        }
    } catch (error) {
        return {
            status: 500,
            message: "An error occurred while updating the token use.",
            success: false,
        };
    }
}