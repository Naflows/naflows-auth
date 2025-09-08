import { Collection } from "mongoose";
import { db } from "../../..";
import { User } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import secure from "../dir";



export default async function getUser(userID : string, hash : boolean = true) : Promise<User> {
    const usersCollection = db.collection("users") as Collection<User>;
    const user : User = await usersCollection.findOne({ id: userID }) as User;
    return user;
}