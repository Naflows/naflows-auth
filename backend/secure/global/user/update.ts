import { db } from "../../..";
import { User } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";


export async function updateUser(userId: string, updateData: User) : Promise<ReplyType> {
    const users = db.collection("users");
    const result = await users.updateOne({ id: userId }, { $set: updateData });
    if (result.modifiedCount === 0) {
        console.error("\x1b[31m%s\x1b[0m", "User not found at update.");
        return { success: false, status: 404, message: "User not found." };
    }
    return { success: true, status: 200, message: "User updated successfully." };
}