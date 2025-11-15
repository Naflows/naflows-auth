import { db } from "../../..";
import { software } from "../../../software/dir";
import { services } from "../dir";


export async function generateBasicServiceTunnels(service_id: string, owner_id: string) {


    const serviceAdminRight = await services.service.rights.create(service_id, "Administrator", "Administrators with full access to manage tunnels, developers, users, roles, service settings, and tokens.", ["MANAGE_TUNNELS", "MANAGE_DEVS", "VIEW_STATS", "READ", "WRITE", "DELETE", "MANAGE_USERS", "MANAGE_RIGHTS", "MANAGE_SERVICE", "MANAGE_SETTINGS","MANAGE_RIGHTS", "VIEW_USERS", "VIEW_RIGHTS", "VIEW_SERVICE", "VIEW_SETTINGS", "DEV_TOKEN_CREATION", "PROD_TOKEN_CREATION"], false, "SERVICE_BY_NASS");
    const serviceDevRight = await services.service.rights.create(service_id, "Developer", "Developers of the service who manage tunnels, developers, and view stats.", ["MANAGE_TUNNELS", "MANAGE_DEVS", "VIEW_STATS", "DEV_TOKEN_CREATION", "VIEW_LOGS", "MANAGE_RIGHTS"], false, "SERVICE_BY_NASS");
    const serviceNormalRight = await services.service.rights.create(service_id, "User", "Regular users with permissions to read, write, and delete their own data.", ["READ_OWN", "WRITE_OWN", "DELETE_OWN"], false, "SERVICE_BY_NASS");

    if (!serviceDevRight.success || !serviceAdminRight.success || !serviceNormalRight.success) {
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