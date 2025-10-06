import { db } from "../../..";
import { software } from "../../../software/dir";
import { APIKey } from "../../../types/.types/collections.type";
import secure from "../../global/dir";
import { services } from "../dir";
import crypto from 'crypto';

export async function createAPIKey(apiID : string, userID : string) {
    const keysCollection = db.collection('nass_api_keys');
    if ((await services.service.key.getByApi(apiID)).success) {
        // Force reload and delete
        await keysCollection.deleteOne({ apiId: apiID });
    }

    const keyValue = crypto.randomBytes(32).toString('hex');
    const newKey : APIKey = {
        id: crypto.randomUUID(),
        key: keyValue,
        issuerId: userID,
        apiId: apiID,
        issuedAt: Date.now(),
        expiresAt: Date.now() + (1000 * 60 * 60 * 24 * 365), // 1 year
    };

    await keysCollection.insertOne(newKey);
    await services.service.logs.create(apiID, `API Key created`, "DEVELOPERS", "INFO", { user: userID });
    return software.methods.serverReply(200, "API Key created.", { key: keyValue, keyId: newKey.id });
}