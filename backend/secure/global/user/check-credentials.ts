import { Collection } from "mongoose";
import { User } from "../../../types/.types/collections.type";
import { db } from "../../..";
import secure from "../dir";




export async function checkUserCredentials(userID: string | null, password: string, identifier : string) : Promise<boolean> {
    const userCollection : Collection<User> = db.collection("users");
    if (!userCollection) throw new Error("Internal Server Error: Failed to connect to the database.");

    const user: User = await userCollection.findOne({ id: userID });
  

    if (!user || user == undefined || user == null) return false;

    const isPasswordValid = secure.verify(password, user.password);
    const isIdentifierCorrect = secure.verify(identifier, user.identifier);


    return isPasswordValid && isIdentifierCorrect;

}