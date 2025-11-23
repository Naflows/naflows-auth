import { Collection } from "mongoose";
import { db } from "../../..";
import { ServiceLog, User } from "../../../types/.types/collections.type";
import secure from "../../global/dir";
import { services } from "../dir";



export async function getServiceLogs(service_id: string, limit: number = 50, offset: number = 0, filters: {
    dateFrom?: string;
    dateTo?: string;
    level?: string;
    user?: string;
    type?: string;
}): Promise<{ logs: ServiceLog[], total: number, tabs: number }> {
    const logsCollection: Collection<ServiceLog> = db.collection("service_logs") as Collection<ServiceLog>;
    const logs = await logsCollection.find({
        service_id: service_id,
        ...(filters.level ? { level: filters.level as "INFO" | "WARNING" | "ERROR" } : {}),
    }).sort({ created_at: -1 }).skip(offset).limit(limit).toArray();
    const fullLength = await logsCollection.countDocuments({ service_id });
    console.log(`[Service Logs] Total logs for service ${service_id}:`, fullLength);


    // Check all metadata fields are objects
    console.log("[Service Logs] Retrieving logs for service:", service_id);
    for (const log of logs) {
        console.log("Log metadata:", log.metadata);
        if (log.metadata && log.metadata.user != undefined && log.metadata.user) {
            console.log("Fetching user data for user ID:", log.metadata.user);
            const user: User = await secure.user.get(log.metadata.user, false);
            if (user) {
                const rights = await services.service.user.getRights(user.id, service_id);
                console.log("User rights found:", rights);
                console.log("User data found:", user);
                log.metadata.userData = {
                    username: user.username ?? "Unknown User",
                    picture: user.profile_picture ?? null,
                    first_name: user.first_name ?? null,
                    last_name: user.last_name ?? null,
                    rights: rights ? rights.map(r => ({ id: r.id, name: r.name, hue: r.hue })) : []
                };
            }
        }
    }

    return {
        logs: logs,
        total: fullLength,
        tabs: Math.ceil(fullLength / limit)
    };
}