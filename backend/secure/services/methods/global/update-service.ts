import { software } from "../../../../software/dir";
import { Service } from "../../../../types/.types/collections.type";
import { ReplyType } from "../../../../types/.types/reply.type";
import secure from "../../../global/dir";
import { services } from "../../dir";


export async function updateServiceRoute(req, res, user) {
    const serviceID = req.body.service.id;
    console.log("Request to update service received for service ID:", serviceID, "by user:", user.username);
    const service = user.services ? user.services[serviceID] : null;
    if (!service || !service.rights.includes("ADMINISTRATOR")) {
        return res.status(403).json(software.methods.serverReply(403, "You do not have permission to update this service.", {
            middleware: req.middleware.data,
        }));
    }


    const serviceData = await services.service.get(serviceID);
    if (!serviceData.success || !serviceData.data) {
        return res.status(404).json(software.methods.serverReply(404, "Service not found.", {
            middleware: req.middleware.data,
        }));
    }


    const serviceInfo = serviceData.data as Service;
    serviceInfo.name = req.body.service.name || serviceInfo.name;
    serviceInfo.description = req.body.service.description || serviceInfo.description;
    serviceInfo.picture = req.body.service.profileImage || serviceInfo.picture;
    serviceInfo.banner = req.body.service.bannerImage || serviceInfo.banner;
    serviceInfo.public_settings.allow_public_visibility = req.body.service.allow_public_visibility !== undefined ? req.body.service.allow_public_visibility : serviceInfo.public_settings.allow_public_visibility;

    const update: ReplyType = await services.service.global.update(serviceID, serviceInfo);
    await services.service.logs.create(serviceID, `Service public details (${Object.keys(req.body.service).join(", ")}) updated.`, "SETTINGS", "INFO", { user: user.id });

    res.status(update.status).json({
        status: update.status,
        message: update.message,
        success: update.success,
        data: {
            middleware: req.middleware.data,
        }
    });
}