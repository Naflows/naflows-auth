import { Collection } from "mongoose";
import { db } from "../../../..";
import { software } from "../../../../software/dir";
import { ReplyType } from "../../../../types/.types/reply.type";
import { ServiceRights } from "../../../../types/.types/tunneling.type";
import { services } from "../../dir";
import { Service, User } from "../../../../types/.types/collections.type";


export async function updateLiteralRight(right: ServiceRights, user : User, service : Service): Promise<ReplyType> {
    const rightsCollection = db.collection('service_rights') as Collection<ServiceRights>;

    if (!rightsCollection) {
        return software.methods.serverReply(500, "Internal Server Error: Rights collection not found.");
    }

    const existingRight = await rightsCollection.findOne({ id: right.id });

    if (!existingRight) {
        return software.methods.serverReply(404, "Right not found.");
    }

    console.log("User", user.username, "is attempting to update right:", right);
    const hasRight = await services.service.user.hasRight(user.id, service.id, "MANAGE_RIGHTS");
    if (!hasRight) {
        return software.methods.serverReply(403, "Forbidden: You do not have permission to update this right.");
    }

    const orderEdition = await services.service.rights.canUserEdit(user.id, service.id, [right]);
    if (!orderEdition.success || !orderEdition.data.rights[0].can_edit) {

        return software.methods.serverReply(403, "Forbidden: You do not have permission to update the order of this right.");

    }

    const updateResult = await rightsCollection.updateOne(
        { id: right.id },
        {
            $set: {
                name: right.name,
                description: right.description,
                order: right.order,
                hue: right.hue,
                updated_at: Date.now(),
                rights: right.rights
            }
        }
    );

    if (!updateResult.acknowledged) {
        return software.methods.serverReply(500, "Internal Server Error: Failed to update right.");
    }

    return software.methods.serverReply(200, "Right updated successfully.");
}