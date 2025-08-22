import { Collection } from "mongoose";
import { User } from "../../../../types/.types/collections.type";
import { db } from "../../../..";
import { software } from "../../../../software/dir";
import secure from "../../dir";



export async function checkUserCredentials(userID: string, password: string, identifier : string) : Promise<boolean> {
    const userCollection : Collection<User> = db.collection("users");
    if (!userCollection) throw new Error("Internal Server Error: Failed to connect to the database.");

    const user = await userCollection.findOne({ id: secure.hash(userID) });

    console.log(`User found: ${JSON.stringify(user)}`)


    if (!user || user == undefined || user == null) return false;

    console.log(`User: ${JSON.stringify(user)}`);
    console.log(`Credentials given: ${JSON.stringify({ password, identifier })}`);
    const isPasswordValid = secure.verify(password, user.password);
    const isIdentifierCorrect = secure.verify(identifier, user.identifier);

    console.log(`Password valid: ${isPasswordValid}`);
    console.log(`Identifier correct: ${isIdentifierCorrect}`);

    return isPasswordValid && isIdentifierCorrect;

}