import { PushOperator } from "mongodb";
import { db } from "../../..";
import { software } from "../../../software/dir";
import { User } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import { services } from "../dir";


export async function uploadLegal(serviceId: string, user: User, markdown: string, type: "privacy_policy_url" | "terms_of_service_url" | "contact_email"): Promise<ReplyType> {
    const service = await services.service.get(serviceId);
    if (!service) return software.methods.serverReply(404, "Service not found.");
    if (!services.service.user.hasRight(user.id, serviceId, "MANAGE_SERVICE")) {
        return software.methods.serverReply(403, "You do not have permission to manage this service.");
    }

    // Replace all "-" with "_" in type
    if (!["privacy_policy", "terms_of_service"].includes(type)) {
        type+="_url";
    }
    type = type.replace(/-/g, "_") as "privacy_policy_url" | "terms_of_service_url" | "contact_email";

    const serviceData = service.data.service;

    const servicesCollection = db.collection("services");
    const update: PushOperator<{}> = {
        [`details.public.${type}.history`]: {
            updated_at: Date.now(),
            previous_value: serviceData.details.public?.[type]?.value || "null"
        }
    };
    const updateResult = await servicesCollection.updateOne(
        { id: serviceId },
        {
            $set: {
                [`details.public.${type}.value`]: markdown,
                [`details.public.${type}.approved`]: false,
            },
            $push: update
        }
    );

    if (updateResult.modifiedCount === 0) {
        return software.methods.serverReply(500, "Failed to update Terms of Service.");
    }

    await services.service.logs.create(serviceId, `${type.replace(/_/g, ' ')} updated`, "SERVICE", "WARNING", { user: user.id });

    return software.methods.serverReply(200, "Terms of Service updated successfully.");
}