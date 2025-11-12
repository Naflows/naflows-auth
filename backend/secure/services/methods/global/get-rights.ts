import { User } from "../../../../types/.types/collections.type"
import { Request, Response } from "express";
import { services } from "../../dir";
import { software } from "../../../../software/dir";


export async function getRights(req: Request, res: Response, user: User) {
    // Check if user has the right to view rights
    const serviceID = req.body.service_id;
    if (!serviceID) {
        return software.methods.directResponse(400, "service_id is required.", res, req);
    }

    const service = await services.service.get(serviceID);
    if (!service.success) {
        return software.methods.directResponse(404, "Service not found.", res, req);
    }

    const isDev = (await services.service.user.isDev(user.id, serviceID)).success || await services.service.user.hasRight(user.id, serviceID, "VIEW_RIGHTS");
    if (!isDev) {
        return software.methods.directResponse(403, "You do not have permission to view rights for this service.", res, req);
    }

    const rights = await services.service.rights.getAll(serviceID);
    const canEdit = await services.service.rights.canUserEdit(user.id, serviceID, rights);

    if (!canEdit.success) {
        return software.methods.directResponse(500, "Failed to determine user edit capabilities.", res, req);
    }

    return software.methods.directResponse(200, "Rights retrieved successfully.", res, req, { rights: canEdit.data.rights });
}