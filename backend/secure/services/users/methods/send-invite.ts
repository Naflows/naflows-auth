import { Collection } from "mongoose";
import { db } from "../../../..";
import { software } from "../../../../software/dir";
import { User, UserConnections } from "../../../../types/.types/collections.type";
import { ReplyType } from "../../../../types/.types/reply.type";
import secure from "../../../global/dir";
import { services } from "../../dir";


export default async function sendInvite(userID: string, serviceId: string, targetID : string) : Promise<ReplyType> {
    const service = await services.service.get(serviceId);

    if (!service) {
        return software.methods.serverReply(404, "Service not found.");
    }

    const serviceData = service.data.service;
    if (!(await services.service.global.isApproved(serviceId))) {
        return software.methods.serverReply(403, "Cannot send invitations for unapproved services.");
    }
    
    if (serviceData.public_settings.allow_user_registration) {
        return software.methods.serverReply(400, "This service allows public user registration; invitations are not required.");
    }

    const user = await secure.user.get(userID, false);
    if (!user) {
        return software.methods.serverReply(404, "User not found.");
    }

    const targetUser = await secure.user.get(targetID, false);
    if (!targetUser) {
        return software.methods.serverReply(404, "Target user not found.");
    }

    // Check if the user has permission to invite others to the service
    const hasPermission = await services.service.user.hasRight(userID, serviceId, "MANAGE_USERS");
    if (!hasPermission) {
        return software.methods.serverReply(403, "You do not have permission to invite users to this service.");
    }

    const userConnections = db.collection("user_connections") as Collection<UserConnections>;
    const existingInvite = await userConnections.findOne({
        service_id: serviceId,
        user_id: targetID,
        sent_by: userID,
        status: "PENDING"
    });

    if (existingInvite) {
        return software.methods.serverReply(409, "An invitation has already been sent to this user and is still pending.");
    }

    const inviteExpiry = Date.now() + (7 * 24 * 60 * 60 * 1000); // Invite expires in 7 days

    const result = await userConnections.insertOne({
        id: await secure.system.generateID("user_connections"),
        user_id: targetID,
        service_id: serviceId,
        connected_at: Date.now(),
        status: "PENDING",
        sent_by: userID,
        expires_at: inviteExpiry
    });

    if (!result.acknowledged) {
        return software.methods.serverReply(500, "Failed to send invitation. Please try again later.");
    }

    return software.methods.serverReply(200, "Invitation sent successfully.");
}