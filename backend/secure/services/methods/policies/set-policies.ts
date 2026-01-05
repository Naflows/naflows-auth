import { db } from "../../../..";
import { software } from "../../../../software/dir";
import { ReplyType } from "../../../../types/.types/reply.type";
import { services } from "../../dir";


export default async function setPolicies(
    userId: string,
    serviceId: string,
    policies: string[]
): Promise<ReplyType> {
    const service = await services.service.get(serviceId,false);

    if (!service) {
        return software.methods.serverReply(404, "Service not found");
    }
    
    const hasRight = await services.service.user.hasRight(userId,serviceId,"MANAGE_SERVICE");

    if (!hasRight) {
        return software.methods.serverReply(403, "You do not have permission to manage this service");
    }

    const serviceData = service.data.service;
    
    serviceData.public_settings.required_data = policies;

    const updateResult = await services.service.global.update(
        serviceId,
        serviceData
    );

    if (!updateResult.success) {
        return software.methods.serverReply(500, "Failed to update service policies.");
    }

    await services.service.logs.create(serviceId,`Service policies updated: ${policies.join(", ")} set as new required data`,"SERVICE","INFO",{
        userId: userId
    });

    return software.methods.serverReply(200, "Service policies updated successfully");
}