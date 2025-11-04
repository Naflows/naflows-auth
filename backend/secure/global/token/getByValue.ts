import { db } from "../../..";
import { Tokens } from "../../../types/.types/collections.type";
import secure from "../dir";



export async function getTokenByValue(value: string, hash = true) : Promise<Tokens | null> {
    const tokensCollection = db.collection('tokens');
    if (!tokensCollection) {
        console.error("Tokens collection not found in database.");
        return null;
    }
    if (!hash) {
        // Get all tokens and compare unhashed
        const allTokens = await tokensCollection.find({}).toArray() as unknown as Tokens[];
        for (const token of allTokens) {
            if (secure.verify(value, token.token)) {
                return token;
            }
        }
        return null;
    }

    // Find token by value
    const token = await tokensCollection.findOne({ token: value }) as unknown as Tokens;
    return token;
}