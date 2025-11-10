import { Collection } from "mongoose";
import { db } from "../../../..";
import { software } from "../../../../software/dir";
import { ReplyType } from "../../../../types/.types/reply.type";
import { ServiceRights } from "../../../../types/.types/tunneling.type";


export async function updateLiteralRight(right: ServiceRights): Promise<ReplyType> {
    const rightsCollection = db.collection('service_rights') as Collection<ServiceRights>;

    if (!rightsCollection) {
        return software.methods.serverReply(500, "Internal Server Error: Rights collection not found.");
    }

    const existingRight = await rightsCollection.findOne({ id: right.id });

    if (!existingRight) {
        return software.methods.serverReply(404, "Right not found.");
    }

    const updateResult = await rightsCollection.updateOne(
        { id: right.id },
        {
            $set: {
                name: right.name,
                description: right.description,
                order: right.order,
                updated_at: Date.now()
            }
        }
    );

    if (!updateResult.acknowledged) {
        return software.methods.serverReply(500, "Internal Server Error: Failed to update right.");
    }

    return software.methods.serverReply(200, "Right updated successfully.");
}