import { db } from "../../..";
import { software } from "../../../software/dir";
import { User } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";


export async function updateUser(userId: string, updateData: User) : Promise<ReplyType> {
    const users = await db.collection("users");
    if (!users) {
        console.error("\x1b[31m%s\x1b[0m", "Database connection error at user update.");
        return software.methods.serverReply(500, "Database connection error.");
    }
    const result = await users.updateOne({ id: userId }, { $set: updateData });
    if (!result || typeof result.modifiedCount !== "number" || result.modifiedCount === 0) {
        return software.methods.serverReply(500, "Failed to update user. No changes were made.");
    }
    return software.methods.serverReply(200, "User updated successfully.");
}