import { Collection } from "mongoose";
import { db } from "../../../..";
import { software } from "../../../../software/dir";
import { ReplyType } from "../../../../types/.types/reply.type";
import { services } from "../../dir";
import { UserRights } from "../../../../types/.types/tunneling.type";
import secure from "../../../global/dir";
import { User } from "../../../../types/.types/collections.type";

export async function updateRights(userId : string, serviceId : string, rightsIds : string[], author : User) : Promise<ReplyType> {
    const userRightsCollection = db.collection('user_rights') as Collection<UserRights>;

    const userRights = await userRightsCollection.findOne({ user_id: userId, service_id: serviceId }) as UserRights;
    const user = await secure.user.get(userId, false);
    if (!user) {
        return software.methods.serverReply(404, "User not found.");
    }

    if (!userRights) {
        return software.methods.serverReply(404, "User rights not found for the specified service.");
    }

    await services.service.logs.create(serviceId, `Updated rights for ${user.username} (${userId})`, "USER", "INFO", {
        user: userId,
        message : `From ${JSON.stringify(userRights.rights)} to ${JSON.stringify(rightsIds)}`
    });

    // If a right happens to be the "DEVELOPER" right, ensure the user is registered as a developer for the service
    const developerRight = await services.service.rights.get("Developer", serviceId, "SERVICE_BY_NASS");
    if (!developerRight) {
        return software.methods.serverReply(500, "Failed to retrieve developer right information.");
    }
    if (rightsIds.includes(developerRight.id)) {
        const isDev = await services.service.user.isDev(userId, serviceId);
        if (!isDev.success) {
            const registerDevRT = await services.service.dev.register(serviceId, userId, author);
            if (!registerDevRT.success) {
                return software.methods.serverReply(500, "Failed to register user as developer while updating rights.");
            }
        } 
    } else {
        // If the user previously had the DEVELOPER right but it's being removed now, we might want to unregister them as a developer
        const isDev = await services.service.user.isDev(userId, serviceId);
        if (isDev.success) {
            const unregisterDevRT = await services.service.dev.unregister(serviceId, userId, author);
            if (!unregisterDevRT.success) {
                return software.methods.serverReply(500, "Failed to unregister user as developer while updating rights.");
            }
        }
    }

    userRights.rights = rightsIds;
    userRights.updated_at = Date.now();

    const result = await userRightsCollection.updateOne({ id: userRights.id }, { $set: userRights });

    if (!result) {
        return software.methods.serverReply(500, "Failed to update user rights.");
    }

    await services.service.logs.create(serviceId, `Updated rights for ${user.username} (${userId})`, "USER", "INFO", {
        user: author.id,
        message : `User rights for ${user.username} (${userId}) updated by ${author.username}`
    });

    return software.methods.serverReply(200, "User rights updated successfully.");


}