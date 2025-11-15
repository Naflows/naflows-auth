import { User } from "../../../../types/.types/collections.type";
import { Request, Response } from "express";
import { services } from "../../dir";
import { software } from "../../../../software/dir";

export async function getUsers(req : Request, res : Response, user : User) {

    const serviceRT = await services.service.get(req.body.service_id);
    if (!serviceRT) {
        return software.methods.directResponse(404, "Service not found.", res, req);
    }

    const service = serviceRT.data.service;


    // Check if user has the right to view users
    const hasRight : boolean = await services.service.user.hasRight(user.id, service.id, "VIEW_USERS");

    if (!hasRight) {
        return software.methods.directResponse(403, "Forbidden: You do not have permission to view service users.", res, req);
    }

    const reply = await services.service.user.getAll(service.id, user.id);

    return software.methods.directResponse(200, "Service users retrieved successfully.", res, req, reply.data);
}