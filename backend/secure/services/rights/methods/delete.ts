import { Collection } from "mongoose";
import { db } from "../../../..";
import { software } from "../../../../software/dir";
import { User } from "../../../../types/.types/collections.type";
import { ReplyType } from "../../../../types/.types/reply.type";
import { ServiceRights, UserRights } from "../../../../types/.types/tunneling.type";
import { services } from "../../dir";

export async function deleteRight(service_id: string, user : User, right_id: string) : Promise<ReplyType> {
    const serviceRT : ReplyType = await services.service.get(service_id);
    if (!serviceRT.success) {
        return serviceRT;
    }


    const service = serviceRT.data.service;
    const right : ServiceRights = await services.service.rights.get(right_id, service.id);
    if (!right) {
        return software.methods.serverReply(404, "The specified right does not exist for this service.");
    }

    const serviceRightsDB = db.collection('service_rights') as Collection<ServiceRights>;
    
    const deleteResult = await serviceRightsDB.deleteOne({ id: right_id, service_id: service.id });
    if (deleteResult.deletedCount === 0) {
        return software.methods.serverReply(500, "Failed to delete the specified right. Please try again later.");
    }

    const userRightsDB = db.collection('user_rights') as Collection<UserRights>;
    // Remove the right from all users who had it
    await userRightsDB.updateMany(
        { service_id: service.id, rights: right_id },
        { $pull: { rights: right_id } }
    );


    return software.methods.serverReply(200, "Right deleted successfully.");
}