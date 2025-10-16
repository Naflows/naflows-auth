import { Collection } from "mongoose";
import { db } from "../../..";
import { User } from "../../../types/.types/collections.type";

export async function getUserByUsername(username: string): Promise<User | null> {
    const userCollection: Collection<User> = db.collection("users");
    return userCollection.findOne({ username });
}