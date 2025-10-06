import { Collection } from "mongoose";
import { db } from "../../..";
import { ServiceLog, User } from "../../../types/.types/collections.type";
import secure from "../../global/dir";



export async function getServiceLogs(service_id: string, limit: number = 50, offset: number = 0): Promise<ServiceLog[]> {
    const logsCollection: Collection<ServiceLog> = db.collection("service_logs") as Collection<ServiceLog>;
    const logs = await logsCollection.find({ service_id }).sort({ created_at: -1 }).skip(offset).limit(limit).toArray();

    // Check all metadata fields are objects
    console.log("[Service Logs] Retrieving logs for service:", service_id);
    for (const log of logs) {
        console.log("Log metadata:", log.metadata);
        if (log.metadata && log.metadata.user != undefined && log.metadata.user) {
            console.log("Fetching user data for user ID:", log.metadata.user);
            const user: User = await secure.user.get(log.metadata.user, false);
            if (user) {
                console.log("User data found:", user);
                log.metadata.userData = {
                    username: user.username ?? "Unknown User",
                    picture: user.profile_picture ?? null,
                    first_name: user.first_name ?? null,
                    last_name: user.last_name ?? null,
                };
            }
        }
    }

    return logs;
}