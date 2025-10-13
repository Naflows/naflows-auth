import { User } from "../../../../types/.types/collections.type";
import { services } from "../../dir";
import { Request, Response } from "express";

export async function getApiKey(req : Request, res : Response, user : User) {

    const { service_id } = req.body;
    if (!service_id) {
        return res.status(400).json({ success: false, message: "Bad request. 'service_id' is required.", status : 400, data : {
            middleware: req.middleware.data
        } });
    }

    const service = await services.service.get(service_id);
    if (!service.success) {
        return res.status(404).json({ success: false, message: "Service not found.", status : 404, data : {
            middleware: req.middleware.data
        } });
    }

    const isUserDev = await services.service.user.isDev(user.id, service_id);
    if (!isUserDev.success) {
        return res.status(403).json({ success: false, message: "Forbidden. You do not have permission to access this service's API key.", status : 403, data : {
            middleware: req.middleware.data
        } });
    }

    const apiKey = await services.service.key.getByApi(service_id);
    if (!apiKey.success) {
        res.status(500).json({ success: false, message: "Internal server error. API Key not found for the service.", status : 500, data : {
            middleware: req.middleware.data
        } });
    }

    await services.service.logs.create(
        service_id,
        `User retrieved API key.`,
        "SECURITY", "WARNING", {
            user : user.id,
            message : "Queried from get-api-key endpoint."
        }
    );

    return res.status(200).json({ success: true, message: "API Key retrieved successfully.", status : 200, data : {
        middleware: req.middleware.data,
        key: apiKey.data.key.key
    } });
}