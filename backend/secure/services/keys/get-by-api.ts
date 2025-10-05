import { db } from "../../..";
import { software } from "../../../software/dir";


export async function getKeyByIPID(apiID : string) {
    const keysCollection = db.collection('nass_api_keys');
    const apiKey = await keysCollection.findOne({ apiId: apiID });
    if (!apiKey) {
        return software.methods.serverReply(404, "API Key not found.");
    }
    return software.methods.serverReply(200, "API Key found.", { key: apiKey });
}