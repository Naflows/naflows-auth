import { Request, Response } from "express";
import { ReplyType } from "../../types/.types/reply.type";
import { services } from "../../secure/services/dir";
import { Service } from "../../types/.types/collections.type";
import { software } from "../../software/dir";


export async function isServiceActive(req : Request, res : Response)  : Promise<boolean> {
    const apiId = req.body.apiID;
    if (!apiId) {
        return res.status(400).json({ success: false, message: "apiID is required." });
    }

    const serviceRT : ReplyType = await services.service.get(apiId);
    if (!serviceRT.success) {
        return res.status(404).json({ success: false, message: "Service not found." });
    }

    const service = serviceRT.data.service as Service;
    if (service.status !== "ACTIVE") {
        return false;
    }
    return true;
    
}