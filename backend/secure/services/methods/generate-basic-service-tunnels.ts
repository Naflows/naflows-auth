import { db } from "../../..";
import { software } from "../../../software/dir";
import { services } from "../dir";


export async function generateBasicServiceTunnels(service_id: string, owner_id: string) {


    const serviceDevRight = await services.service.rights.create(service_id, "Developer", ["MANAGE_TUNNELS", "MANAGE_DEVS", "VIEW_STATS"]);
    const serviceAdminRight = await services.service.rights.create(service_id, "Administrator", ["MANAGE_TUNNELS", "MANAGE_DEVS", "VIEW_STATS", "READ", "WRITE", "DELETE", "MANAGE_USERS", "MANAGE_ROLES", "MANAGE_SERVICE", "MANAGE_SETTINGS", "VIEW_USERS", "VIEW_ROLES", "VIEW_SERVICE", "VIEW_SETTINGS"]);
    const singleUserRight = await services.service.rights.create(service_id, "User", ["READ", "WRITE", "DELETE"]);

    if (!serviceDevRight.success || !serviceAdminRight.success || !singleUserRight.success) {
        return software.methods.serverReply(500, "Failed to create automatic rights.");
    }

    const serviceUserRight = await services.service.rights.assign(serviceDevRight.data.right.id, owner_id, service_id);
    const serviceAdminUserRight = await services.service.rights.assign(serviceAdminRight.data.right.id, owner_id, service_id);
    const singleUserUserRight = await services.service.rights.assign(singleUserRight.data.right.id, owner_id, service_id);

    if (!serviceUserRight.success || !serviceAdminUserRight.success || !singleUserUserRight.success) {
        return software.methods.serverReply(500, "Failed to assign user rights.");
    }

    return software.methods.serverReply(200, "Basic service tunnels generated successfully.");
}