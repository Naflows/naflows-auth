import { software } from "../../../../software/dir";
import { ReplyType } from "../../../../types/.types/reply.type";
import { ServiceRights } from "../../../../types/.types/tunneling.type";
import { services } from "../../dir";


export async function canUserEdit(userID: string, serviceID: string, rights: ServiceRights[]): Promise<ReplyType> {

    const userRights = await services.service.user.getRights(userID, serviceID);
    const service = await services.service.get(serviceID);
    if (!service.success) {
        return software.methods.serverReply(404, "Service not found.");
    }



    const canManage = await services.service.user.hasRight(userID, serviceID, "MANAGE_RIGHTS");


    // The smallest order number is the highest priority
    const priorityOrder = userRights.reduce((min, r) => r.order < min ? r.order : min, Number.MAX_SAFE_INTEGER);


    console.log("Priority order num:", priorityOrder, "User rights:", userRights, "Can manage:", canManage);

    await Promise.all(rights.map(async (r) => {
        r.can_edit = false;
        // If the user can manage rights and the right's order is greater than the priority order, they can edit it
        if (
            ((canManage && r.order > priorityOrder) || service.data.service.created_by === userID) ||
            (r.type === "TUNNELING_BY_INSTANCE" && (await services.service.user.hasRight(userID, serviceID, "MANAGE_RIGHTS")))

        ) {
            r.can_edit = true;
        }

    }));

    return software.methods.serverReply(200, "User edit capabilities determined.", { rights: rights });
}