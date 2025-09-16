import { db } from "../../..";
import { Tokens } from "../../../types/.types/collections.type";



export async function getTokenByValue(value: string) : Promise<Tokens | null> {
    const tokensCollection = db.collection('tokens');
    if (!tokensCollection) {
        console.error("Tokens collection not found in database.");
        return null;
    }
    // Log all tokens in db
    console.log("All tokens in DB:", await tokensCollection.find({}).toArray());
    // Find token by value
    const token = await tokensCollection.findOne({ token: value }) as unknown as Tokens;
    return token;
}