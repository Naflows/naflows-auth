import { software } from "../../../../software/dir";
import { Service } from "../../../../types/.types/collections.type";
import { ReplyType } from "../../../../types/.types/reply.type";
import { services } from "../../dir";


export async function updatePublicDetails(
    serviceId: string,
    userId: string,
    details: Service["public_settings"]
): Promise<ReplyType> {
    const service = await services.service.get(serviceId, false);
    if (!service) {
        return software.methods.serverReply(404, "Service not found");
    }

    const hasRights = await services.service.user.hasRight(
        userId,
        serviceId,
        "MANAGE_SERVICE"
    );

    if (!hasRights) {
        return software.methods.serverReply(403, "You do not have permission to manage this service");
    }


    const serviceData = service.data.service;
    serviceData.public_settings = {
        ...serviceData.public_settings,
        ...details
    }

    const updateResult = await services.service.global.update(
        serviceId,
        serviceData
    );

    if (!updateResult) {
        return software.methods.serverReply(500, "Failed to update service public details");
    }

    return software.methods.serverReply(200, "Service public details updated successfully");

}