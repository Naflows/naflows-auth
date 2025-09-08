import { Collection } from "mongoose";
import { db } from "../../..";
import { Tokens } from "../../../types/.types/collections.type";
import secure from "../dir";


export default async function getToken(id : string, hash : boolean = false) : Promise<Tokens> {
    const tokensCollection : Collection<Tokens> = await db.collection("tokens") as Collection<Tokens>;

    function getTokenByHashedID(hashedID : string) : Promise<Tokens | null> {
        return new Promise(async (resolve) => {
            const allTokens = await tokensCollection.find({}).toArray() as Tokens[];
            for (const token of allTokens) {
                if (secure.hash(token.id) === hashedID) {
                    return resolve(token);
                }
            }
            return resolve(null);
        });
    }

    return hash ? await getTokenByHashedID(id) : await tokensCollection.findOne({ id: id }) as Tokens;
}