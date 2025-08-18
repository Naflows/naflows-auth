import { software } from "../../../../software/dir";
import { ReplyType } from "../../../../types/.types/reply.type";



export async function checkRates(api_id) : Promise<ReplyType> {
    

    return software.methods.serverReply(200, "Rates check not implemented yet.");
}