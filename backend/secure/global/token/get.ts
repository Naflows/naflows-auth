import { Collection } from "mongoose";
import { db } from "../../..";
import { Tokens } from "../../../types/.types/collections.type";
import secure from "../dir";


export default async function getToken(id : string, hash : boolean = false) : Promise<Tokens> {
    const tokensCollection : Collection<Tokens> = await db.collection("tokens") as Collection<Tokens>;

    return await tokensCollection.findOne({ id: (hash ? secure.hash(id) : id) }) as Tokens;
}