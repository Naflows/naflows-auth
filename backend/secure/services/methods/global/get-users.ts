import { User } from "../../../../types/.types/collections.type";
import { Request, Response } from "express";
import { services } from "../../dir";
import { software } from "../../../../software/dir";

export async function getUsers(req : Request, res : Response, user : User) {

    const serviceRT = await services.service.get(req.body.service_id);
    if (!serviceRT) {
        return res.status(404).json({
            success: false,
            status : 404,
            message: "Service not found."
        });
    }

    const service = serviceRT.data.service;


    // Check if user has the right to view users
    const hasRight : boolean = await services.service.user.hasRight(user.id, service.id, "VIEW_USERS");

    if (!hasRight) {
        return res.status(403).json({
            success: false,
            status : 403,
            message: "Forbidden: You do not have permission to view users for this service."
        });
    }

    const reply = await services.service.user.getAll(service.id);

    return software.methods.directResponse(200, "Service users retrieved successfully.", res, req, reply.data);
}