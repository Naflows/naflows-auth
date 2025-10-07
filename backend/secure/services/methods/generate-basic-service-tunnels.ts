import { db } from "../../..";
import { software } from "../../../software/dir";
import { services } from "../dir";


export async function generateBasicServiceTunnels(service_id: string, owner_id: string) {


    const serviceDevRight = await services.service.rights.create(service_id, "Developer", ["MANAGE_TUNNELS", "MANAGE_DEVS", "VIEW_STATS"]);

    if (!serviceDevRight.success) {
        return software.methods.serverReply(500, "Failed to create developer rights.");
    }

    const serviceUserRight = await services.service.rights.assign(serviceDevRight.data.right.id, owner_id, service_id);

    if (serviceUserRight.status !== 201) {
        return software.methods.serverReply(500, "Failed to assign user rights.");
    }

    return software.methods.serverReply(200, "Basic service tunnels generated successfully.");
}