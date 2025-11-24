import { User } from "../../../../types/.types/collections.type";
import { Request, Response } from "express";
import { services } from "../../dir";
import { software } from "../../../../software/dir";

export async function removeRightRoute(req : Request, res : Response, user : User) {
    const serviceRT = await services.service.get(req.body.service_id);
    if (!serviceRT) {
        return software.methods.directResponse(404, "Service not found.", res, req);
    }

    const service = serviceRT.data.service;

    const isUserDev = (await services.service.user.isDev(user.id, service.id)).success || await services.service.user.hasRight(user.id, service.id, "MANAGE_RIGHTS");
    if (!isUserDev) {
        return software.methods.serverReply(403, "You do not have permission to manage rights for this service.");
    }

    const right_id : string = req.body.right_id;
    const deleteRT = await services.service.rights.delete(service.id, user, right_id);
    if (!deleteRT.success) {
        return software.methods.directResponse(deleteRT.status, deleteRT.message, res, req);
    }

    return software.methods.directResponse(200, "Right deleted successfully.", res, req);
}