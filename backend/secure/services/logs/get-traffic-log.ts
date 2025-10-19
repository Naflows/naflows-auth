import { Collection } from "mongoose";
import { ServiceTraffic } from "../../../types/.types/traffic.type";
import { db } from "../../..";
import { software } from "../../../software/dir";
import { ReplyType } from "../../../types/.types/reply.type";

export async function getTrafficLog(service_id : string) : Promise<ReplyType> {
    const serviceTrafficCollection: Collection<ServiceTraffic> = db.collection("service_traffic");

    const trafficLog = await serviceTrafficCollection.findOne({ service_id: service_id });
    
    if (!trafficLog) {
        return software.methods.serverReply(404, "Traffic log not found for the specified service ID.");
    }

    return software.methods.serverReply(200, "Traffic log retrieved successfully.", trafficLog);
}