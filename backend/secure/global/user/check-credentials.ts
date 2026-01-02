import { Collection } from "mongoose";
import { User } from "../../../types/.types/collections.type";
import { db } from "../../..";
import secure from "../dir";




export async function checkUserCredentials( password: string, identifier : string) : Promise<{
    valid : boolean,
    user ?: User
}> {
    const userCollection : Collection<User> = db.collection("users");
    if (!userCollection) throw new Error("Internal Server Error: Failed to connect to the database.");

    const user: User = await userCollection.findOne({ identifier: identifier });
  

    if (!user || user == undefined || user == null) return {
        valid : false
    };

    const isPasswordValid = secure.verify(password, user.password);


    return {
        valid : isPasswordValid,
        user : user
    };

}