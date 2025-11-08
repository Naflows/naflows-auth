import { db } from "../../..";
import { software } from "../../../software/dir";
import { services } from "../dir";


export async function generateBasicServiceTunnels(service_id: string, owner_id: string) {


    const serviceDevRight = await services.service.rights.create(service_id, "Developer", ["MANAGE_TUNNELS", "MANAGE_DEVS", "VIEW_STATS","DEV_TOKEN_CREATION"]);
    const serviceAdminRight = await services.service.rights.create(service_id, "Administrator", ["MANAGE_TUNNELS", "MANAGE_DEVS", "VIEW_STATS", "READ", "WRITE", "DELETE", "MANAGE_USERS", "MANAGE_ROLES", "MANAGE_SERVICE", "MANAGE_SETTINGS", "VIEW_USERS", "VIEW_ROLES", "VIEW_SERVICE", "VIEW_SETTINGS","DEV_TOKEN_CREATION","PROD_TOKEN_CREATION"]);
    const serviceNormalRight = await services.service.rights.create(service_id, "User", ["READ_OWN", "WRITE_OWN", "DELETE_OWN"]);

    if (!serviceDevRight.success || !serviceAdminRight.success) {
        return software.methods.serverReply(500, "Failed to create automatic rights.");
    }

    const serviceUserRight = await services.service.rights.assign(serviceDevRight.data.right.id, owner_id, service_id);
    const serviceAdminUserRight = await services.service.rights.assign(serviceAdminRight.data.right.id, owner_id, service_id);
    const serviceNormalUserRight = await services.service.rights.assign(serviceNormalRight.data.right.id, owner_id, service_id);

    if (!serviceUserRight.success || !serviceAdminUserRight.success || !serviceNormalUserRight.success) {
        return software.methods.serverReply(500, "Failed to assign user rights.");
    }

    return software.methods.serverReply(200, "Basic service tunnels generated successfully.");
}