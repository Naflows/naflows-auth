import { db } from "../../..";
import crypto from "crypto";

export async function generateID(type: "users" | "services"): Promise<string> {
    const collection = await db.collection(type);
    const id = crypto.randomBytes(16).toString("hex");
    const existing = await collection.findOne({ id });
    if (existing) {
        return generateID(type);
    }
    return id;
}