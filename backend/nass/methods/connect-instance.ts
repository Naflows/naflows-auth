import secure from "../../secure/global/dir";
import { Request, Response } from 'express';
import { ReplyType } from "../../types/.types/reply.type";
import { services } from "../../secure/services/dir";
import { Service } from "../../types/.types/collections.type";
import { software } from "../../software/dir";
import middleware from "../../middleware/dir";

export async function connectInstance(req : Request, res : Response) {
    // This function is exclusive to service owners to start/stop their services
    const user = await secure.user.manageConnection(req, res);
    if (!user) {
        return; // manageConnection already sent the response
    }

    const serviceID = req.body.serviceID;
    if (!serviceID) {
        return res.status(400).json(software.methods.serverReply(400, "Bad Request: serviceID is required.", {
            middleware: req.middleware.data
        }));
    }

    const serviceRT : ReplyType = await services.service.get(serviceID);
    if (!serviceRT.success) {
        return res.status(404).json({ success: false, message: "Service not found.", middleware: req.middleware.data });
    }

    const service = serviceRT.data.service as Service;
    if (service.created_by !== user.id) {
        return res.status(403).json(software.methods.serverReply(403, "Forbidden: You do not own this service.", {
            middleware: req.middleware.data
        }));
    }

    service.status = service.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    const update = await services.service.global.update(serviceID, service);
    if (!update.success) {
        return res.status(500).json(software.methods.serverReply(500, "Failed to update service status.", {
            middleware: req.middleware.data
        }));
    }
    

    await services.service.logs.create(serviceID, `Service ${service.status === "ACTIVE" ? "started" : "stopped"}.`, "SYSTEM", "INFO", { user: user.id });

    return software.methods.directResponse(200, `Service ${service.status === "ACTIVE" ? "started" : "stopped"} successfully.`, res, req, {
        success : true,
        service_status : service.status,
    });
}