import { Collection } from "mongoose";
import { db } from "../../..";
import { ServiceLog, User } from "../../../types/.types/collections.type";
import secure from "../../global/dir";
import { services } from "../dir";
import getPicture from "../../../software/data-management/get-picture";



export async function getServiceLogs(service_id: string, limit: number = 50, offset: number = 0, filters: {
    dateFrom?: string;
    dateTo?: string;
    level?: string;
    user?: string;
    type?: string;
}): Promise<{ logs: ServiceLog[], total: number, tabs: number }> {
    const logsCollection: Collection<ServiceLog> = db.collection("service_logs") as Collection<ServiceLog>;

    console.log(`[Service Logs] Fetching logs for service ID: ${service_id} with limit: ${limit}, offset: ${offset}, filters:`, filters);


    const logs = await logsCollection.find({
        service_id: service_id,
        ...(filters.level ? { level: filters.level as "INFO" | "WARNING" | "ERROR" } : {}),
        ...(filters.type ? { type: filters.type as "USER" | "SERVICE" | "SECURITY" | "SYSTEM" | "OTHER" | "SETTINGS" | "DEVELOPERS" } : {}),
        ...(filters.dateFrom ? { created_at: { $gte: new Date(filters.dateFrom).getTime() } } : {}),
        ...(filters.dateTo ? { created_at: { $lte: new Date(filters.dateTo).getTime() } } : {}),
        ...(filters.user ? { "metadata.user": filters.user } : {})
    }).sort({ created_at: -1 }).skip(offset).limit(limit).toArray();
    console.log(`[Service Logs] Total logs for service ${service_id}:`, logs.length);


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
                    picture: await getPicture(user.profile_picture, "user"),
                    first_name: user.first_name ?? null,
                    last_name: user.last_name ?? null,
                    rights: rights ? rights.map(r => ({ id: r.id, name: r.name, hue: r.hue })) : []
                };
            }
        }
    }

    return {
        logs: logs,
        total: logs.length,
        tabs: Math.ceil(logs.length / limit)
    };
}