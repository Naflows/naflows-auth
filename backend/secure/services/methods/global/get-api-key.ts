import { software } from "../../../../software/dir";
import { User } from "../../../../types/.types/collections.type";
import { services } from "../../dir";
import { Request, Response } from "express";

export async function getApiKey(req : Request, res : Response, user : User) {

    const { service_id } = req.body;
    if (!service_id) {
        return software.methods.directResponse(400, "Bad request. 'service_id' is required.", res, req);
    }

    const service = await services.service.get(service_id);
    if (!service.success) {
        return software.methods.directResponse(404, "Service not found.", res, req);
    }

    const isUserDev = await services.service.user.isDev(user.id, service_id);
    if (!isUserDev.success) {
        return software.methods.directResponse(403, "Forbidden. You do not have permission to access this service's API key.", res, req);
    }

    const apiKey = await services.service.key.getByApi(service_id);
    if (!apiKey.success) {
        return software.methods.directResponse(500, "Internal server error. API Key not found for the service.", res, req);
    }

    await services.service.logs.create(
        service_id,
        `User retrieved API key.`,
        "SECURITY", "WARNING", {
            user : user.id,
            message : "Queried from get-api-key endpoint."
        }
    );

    return software.methods.directResponse(200, "API Key retrieved successfully.", res, req, {
        key : apiKey.data.key.key
    });
}