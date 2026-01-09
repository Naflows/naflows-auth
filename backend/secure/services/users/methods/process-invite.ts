import { Collection } from "mongoose";
import { UserConnections } from "../../../../types/.types/collections.type";
import { ReplyType } from "../../../../types/.types/reply.type";
import { db } from "../../../..";
import { software } from "../../../../software/dir";
import { services } from "../../dir";
import secure from "../../../global/dir";



export async function processInvite(userID: string, serviceID: string, status: UserConnections["status"]): Promise<ReplyType> {
    const userConnections = db.collection("user_connections") as Collection<UserConnections>;

    const user = await secure.user.get(userID, false);
    if (!user) {
        return software.methods.serverReply(404, "User not found.");
    }

    const isIn = await services.service.user.isIn(serviceID, userID);
    if (isIn) {
        return software.methods.serverReply(400, "User is already a member of this service.");
    }


    const invite = await userConnections.findOne({
        user_id: userID,
        service_id: serviceID,
        status: "PENDING"
    });

    if (invite.status === status || (status !== "ACCEPTED" && status !== "REJECTED")) {
        return software.methods.serverReply(400, `Invitation is already marked as ${status} or invalid status provided.`);
    }

    if (!invite) {
        return software.methods.serverReply(404, "No pending invitation found for this user and service.");
    }

    if (invite.expires_at < Date.now()) {
        await userConnections.updateOne(
            { id: invite.id },
            { $set: { status: "EXPIRED" } }
        );
        return software.methods.serverReply(400, "This invitation has expired.");
    }



    const update = await userConnections.updateOne(
        { id: invite.id },
        { $set: { status: status, connected_at: Date.now() } }
    );

    if (update.modifiedCount === 1) {

        if (status === "ACCEPTED") {
            const userJoined = await services.service.user.register(user, serviceID, null, true, [""]);

            if (!userJoined.success) {
                return software.methods.serverReply(500, "Failed to register user to the service after accepting the invitation.");
            }

            return software.methods.serverReply(200, "Invitation accepted successfully.");
        } else if (status === "REJECTED") {
            return software.methods.serverReply(200, "Invitation rejected successfully.");
        }
    }

    return software.methods.serverReply(500, "Failed to accept the invitation. Please try again later.");

}