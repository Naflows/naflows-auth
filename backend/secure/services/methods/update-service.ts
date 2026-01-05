import { db } from "../../..";
import { software } from "../../../software/dir";
import { Service } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import { services } from "../dir";
import { Collection } from "mongoose";


export async function updateService(serviceId: string, newServiceData: Service): Promise<ReplyType> {
    const servicesCollection: Collection<Service> = await db.collection("services") as Collection<Service>;
    if (!servicesCollection) {
        return software.methods.serverReply(500, "Database collection 'services' not found.");
    }

    const service = await services.service.get(serviceId, false);
    if (!service) {
        return software.methods.serverReply(404, "Service not found.");
    }
    if (JSON.stringify(service.data.service) === JSON.stringify(newServiceData)) {
        return software.methods.serverReply(200, "No changes detected in service data.");
    }

    console.log("Updating service with ID:", serviceId);
    console.log("New service data:", newServiceData);
    const updt = await servicesCollection.updateOne(
        { id: serviceId },
        { $set: newServiceData }
    );

    if (updt.modifiedCount === 0) {
        return software.methods.serverReply(500, "Failed to update service details.");
    }


    return software.methods.serverReply(200, "Service details updated successfully.");
}