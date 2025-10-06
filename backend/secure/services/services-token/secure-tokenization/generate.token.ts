import crypto from "crypto";
import { v4 } from "uuid";
import { NassServiceToken, ServiceToken } from "../../../../types/.types/collections.type";
import { software } from "../../../../software/dir";
import { Collection } from "mongoose";
import { Service } from "ts-node";
import { db } from "../../../..";
import secure from "../../../global/dir";
import { ReplyType } from "../../../../types/.types/reply.type";
import { services } from "../../dir";

/*

    This is the process of generating a new service token (3).

*/



export async function generateServiceToken(api_id: string, method: "AUTO" | "MANUAL") : Promise<ReplyType> {
    const nassServiceTokens: Collection<NassServiceToken> = await db.collection("service_tokens") as Collection<NassServiceToken>;

    if (!nassServiceTokens) software.methods.serverReply(500, "Internal Server Error: Service tokens collection not found.");

    // Ensuring all the active tokens are invalidated before creating a new one
    const existingToken = await nassServiceTokens.find({
        service_id: api_id
    }).toArray();

   if (existingToken.length > 0) {
       await nassServiceTokens.updateMany({
           service_id: api_id
       }, {
           $set: {
               invalidated: true
           }
       });
   }

    const id = `${api_id}-${Date.now()}-${v4()}`;
    const tokenValue = crypto.randomBytes(32).toString("hex");
    const creation = Date.now();

    // Time is defined in seconds
    const MIN = parseInt(process.env.STC_MINIMAL_TIMEOUT);
    const MAX = parseInt(process.env.STC_MAXIMAL_TIMEOUT);

    if (!MIN || !MAX) return software.methods.serverReply(500, "Internal Server Error: STC_MINIMAL_TIMEOUT or STC_MAXIMAL_TIMEOUT not set in environment variables.");


    const lifespan = Math.random() * (MAX - MIN) + MIN;
    const k = secure.crypt(tokenValue);

    const NassServiceToken: NassServiceToken = {
        id: id,
        token: k,
        service_id: api_id,
        created_at: creation,
        lifespan: lifespan,
        expires_at: creation + lifespan * 1000,
        creation_method: method,
        uses: 0,
    };

    const serviceToken: ServiceToken = {
        id: id,
        token: k,
        created_at: creation
    };

    try {
        await nassServiceTokens.insertOne(NassServiceToken);
        let x = serviceToken;
        x.token = tokenValue;
        await services.service.logs.create(api_id, `A service token was created.`, "DEVELOPERS", "WARNING", { creationMethod: method });
        return software.methods.serverReply(200, "Service token inserted successfully.", { serviceToken: x });
    } catch (error) {
        software.methods.serverReply(500, "Internal Server Error: Failed to insert service tokens with error: " + error.message);
    }
}