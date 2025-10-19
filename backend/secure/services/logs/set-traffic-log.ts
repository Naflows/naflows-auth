import { Collection } from "mongoose";
import { ReplyType } from "../../../types/.types/reply.type";
import { ServiceTraffic, TrafficLogEntry } from "../../../types/.types/traffic.type";
import { db } from "../../..";
import { services } from "../dir";
import { software } from "../../../software/dir";

export async function setTrafficLogs(service_id : string, newLog :TrafficLogEntry) : Promise<ReplyType> {
    const serviceTrafficCollection: Collection<ServiceTraffic> = db.collection("service_traffic");

    const trafficLog = await services.service.logs.getTraffic(service_id);

    if (!trafficLog.success) {
        return software.methods.serverReply(404, "Traffic log not found for the specified service ID.");
    } else {
        const logData = trafficLog.data as ServiceTraffic;
        logData.requests.push(newLog);
        const result = await serviceTrafficCollection.updateOne(
            { service_id: service_id },
            { $set: { requests: logData.requests } }
        );

        if (result.modifiedCount === 1) {
            return software.methods.serverReply(200, "Traffic log updated successfully.");
        } else {
            return software.methods.serverReply(500, "Failed to update traffic log.");
        }
    }
}