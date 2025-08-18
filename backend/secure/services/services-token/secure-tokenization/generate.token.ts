import crypto from "crypto";
import { v4 } from "uuid";
import { NassServiceToken, ServiceToken } from "../../../../types/.types/collections.type";
import { software } from "../../../../software/dir";
import { Collection } from "mongoose";
import { Service } from "ts-node";
import { db } from "../../../..";
import secure from "../../../global/dir";

/*

    This is the process of generating a new service token (3).

*/



export async function generateServiceToken(api_id: string, method: "AUTO" | "MANUAL") {
    const nassServiceTokens: Collection<NassServiceToken> = await db.collection("service_tokens") as Collection<NassServiceToken>;

    if (!nassServiceTokens) software.methods.serverReply(500, "Internal Server Error: Service tokens collection not found.");

    const id = `${api_id}-${Date.now()}-${v4()}`;
    const tokenValue = crypto.randomBytes(32).toString("hex");
    const creation = Date.now();

    // Time is defined in seconds
    const MIN = parseInt(process.env.STC_MINIMAL_TIMEOUT);
    const MAX = parseInt(process.env.STC_MAXIMAL_TIMEOUT);

    if (!MIN || !MAX) return software.methods.serverReply(500, "Internal Server Error: STC_MINIMAL_TIMEOUT or STC_MAXIMAL_TIMEOUT not set in environment variables.");


    const lifespan = Math.random() * (MAX - MIN) + MIN;

    const NassServiceToken: NassServiceToken = {
        id: `${id}<NASS>`,
        token: secure.crypt(tokenValue),
        service_id: api_id,
        created_at: creation,
        lifespan: lifespan,
        expires_at: creation + lifespan * 1000,
        creation_method: method
    };

    const serviceToken: ServiceToken = {
        id: `${id}<SERVICE>`,
        token: secure.crypt(tokenValue),
        created_at: creation
    };

    try {
        await nassServiceTokens.insertOne(NassServiceToken);
        return software.methods.serverReply(200, "Service tokens inserted successfully.", serviceToken);
    } catch (error) {
        software.methods.serverReply(500, "Internal Server Error: Failed to insert service tokens with error: " + error.message);
    }
}