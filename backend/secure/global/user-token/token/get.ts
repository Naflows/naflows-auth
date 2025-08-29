import { Collection } from "mongoose";
import { db } from "../../../..";
import { Tokens } from "../../../../types/.types/collections.type";
import secure from "../../dir";


export default async function getToken(id : string) : Promise<Tokens> {
    const tokensCollection : Collection<Tokens> = await db.collection("tokens") as Collection<Tokens>;

    return await tokensCollection.findOne({ id: secure.hash(id) }) as Tokens;
}