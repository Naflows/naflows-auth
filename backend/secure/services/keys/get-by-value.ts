import { db } from "../../..";
import { software } from "../../../software/dir";
import secure from "../../global/dir";


export async function getKeyByValue(apiID : string) {
    const keysCollection = db.collection('nass_api_keys');
   
    const allKeys = await keysCollection.find({}).toArray();
    const apiKey = allKeys.find(k => secure.verify(k.key, apiID));
    if (!apiKey) {
        return software.methods.serverReply(false, "API Key not found.");
    }

    return software.methods.serverReply(true, "API Key found.", { key: apiKey });
}