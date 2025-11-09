import { User } from "../../../../types/.types/collections.type";
import { services } from "../../dir";
import { software } from "../../../../software/dir";
import { Request, Response } from "express";

export async function assignRights(req : Request, res : Response, user : User) {
    const serviceRT = await services.service.get(req.body.serviceID);
    if (!serviceRT) {
        return software.methods.directResponse(404, "Service not found.", res, req);
    }

    const service = serviceRT.data.service;


    // Check if user has the right to view users
    const hasRight : boolean = await services.service.user.hasRight(user.id, service.id, "MANAGE_USERS");
    if (!hasRight) {
        return software.methods.directResponse(403, "Forbidden: You do not have permission to manage service users.", res, req);
    }

    const targetUserID : string = req.body.userID;
    const rightsIDs : string[] = req.body.rightsIDs;

    if (rightsIDs.length === 0) {
        return software.methods.directResponse(400, "No rights specified to assign.", res, req);
    }


    const updateRT = await services.service.user.updateRights(targetUserID, service.id, rightsIDs, user);
    if (!updateRT.success) {
        return software.methods.directResponse(500, "Failed to assign rights to user.", res, req);
    }

    return software.methods.directResponse(200, "Rights assigned successfully.", res, req);
}