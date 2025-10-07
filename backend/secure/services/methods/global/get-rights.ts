import { User } from "../../../../types/.types/collections.type"
import { Request, Response } from "express";
import { services } from "../../dir";


export async function getRights(req : Request, res : Response, user : User) {
    // Check if user has the right to view rights
    const serviceID = req.body.service_id;
    if (!serviceID) {
        return res.status(400).json({ success: false, message: "service_id is required.", middleware: req.middleware.data });
    }

    const service = await services.service.get(serviceID);
    if (!service.success) {
        return res.status(404).json({ success: false, message: "Service not found.", middleware: req.middleware.data });
    }

    const isDev = await services.service.user.isDev(user.id, serviceID);
    if (!isDev.success) {
        return res.status(403).json({ success: false, message: "You do not have permission to view rights for this service.", middleware: req.middleware.data });
    }

    const rights = await services.service.rights.getAll(serviceID);

    

    return res.status(200).json({
        success: true,
        message: "Rights retrieved successfully.",
        data: {
            rights,
            middleware: req.middleware.data,
        }
    }); 
}