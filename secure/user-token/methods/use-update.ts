import { v4 } from "uuid";
import { db } from "../../..";
import { ReplyType } from "../../../types/.types/reply.type";
import { software } from "../../../software/dir";
import { Collection } from "mongoose";
import { Tokens } from "../../../types/.types/collections.type";


export async function updateTokenUse(tokenId: string): Promise<ReplyType> {
    try {
        const tokensCollection = db.collection("tokens") as Collection<Tokens>;
        const newValue = v4();


        const MIN = parseInt(process.env.STV_MINIMAL_TIMEOUT_MIN);
        const MAX = parseInt(process.env.STV_MINIMAL_TIMEOUT_MAX);
        if (isNaN(MIN) || isNaN(MAX) || MIN < 0 || MAX < 0 || MIN > MAX) {
            return software.methods.serverReply(500, "Invalid timeout configuration.", {
                success: false,
            });
        }

        const timeout = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
        const ts = timeout * 1000;

        console.log(`Timeout: ${ts} ${typeof ts}`)

        const updateResult = await tokensCollection.updateOne(
            { id: tokenId },
            {
                $inc: { uses: 1 }, // Increment the use count
                $set: { updated_at: Date.now(), token: newValue, frozen_at: Date.now(), frozen_until: ts} // Update the timestamp
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



// import { v4 } from "uuid";
// import { db } from "../../..";
// import { ReplyType } from "../../../types/.types/reply.type";
// import { software } from "../../../software/dir";
// import { Collection } from "mongoose";
// import { Tokens } from "../../../types/.types/collections.type";


// export async function updateTokenUse(tokenId: string): Promise<ReplyType> {
//     try {
//         const tokensCollection = db.collection("tokens") as Collection<Tokens>;
//         const newValue = v4(); // Generate a new UUID for the token value


//         const MIN = parseInt(process.env.STV_MINIMAL_TIMEOUT_MIN);
//         const MAX = parseInt(process.env.STV_MINIMAL_TIMEOUT_MAX);
//         if (isNaN(MIN) || isNaN(MAX) || MIN < 0 || MAX < 0 || MIN > MAX) {
//             return software.methods.serverReply(500, "Invalid timeout configuration.", {
//                 success: false,
//             });
//         }

//         const timeout = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
//         const timespan = timeout * 1000;

//         console.log(`Updating token use for ID: ${tokenId}, new value: ${newValue}, timeout: ${timeout} seconds`);

//         const updateResult = await tokensCollection.updateOne(
//             { id: tokenId },
//             {
//                 $inc: { uses: 1 },
//                 $set: { 
//                     updated_at: Date.now(), 
//                     token: newValue, 
//                     frozen_at: Date.now(),
//                     frozen_until: timespan
//                 }, 
//             }
//         );
//         if (updateResult.modifiedCount === 0) {
//             return software.methods.serverReply(404, "Token not found.", {
//                 success: false,
//             });
//         }
//         return software.methods.serverReply(200, "Token use updated successfully.", {
//             token: newValue,
//         });
//     } catch (error) {
//         return software.methods.serverReply(
//             500,
//             "An error occurred while updating the token use: " + (error as Error).message,
//             {
//                 success: false,
//             }
//         );
//     }
// }