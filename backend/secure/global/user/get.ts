import { Collection } from "mongoose";
import { db } from "../../..";
import { User } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import secure from "../dir";
import getPicture from "../../../software/data-management/get-picture";



export default async function getUser(userID : string, hash : boolean = true) : Promise<User> {
    const usersCollection = db.collection("users") as Collection<User>;

    async function getUserByHashedID(hashedUserID : string) : Promise<User | null> {
        const allUsers = await usersCollection.find({}).toArray() as User[];
        for (const user of allUsers) {
            if (secure.verify(user.id, hashedUserID)) {
                user.profile_picture = await getPicture(user.profile_picture, "user");
                return user;
            }
        }
        return null;
    }

    const user : User = hash ? await getUserByHashedID(userID) : await usersCollection.findOne({ id: userID }) as User;
    return user;
}