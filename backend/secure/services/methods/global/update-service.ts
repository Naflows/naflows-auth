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
        return software.methods.directResponse(403, "You do not have permission to update this service.", res, req);
    }


    const serviceData = await services.service.get(serviceID);
    if (!serviceData.success || !serviceData.data) {
        return software.methods.directResponse(404, "Service not found.", res, req);
    }


    const serviceInfo = serviceData.data.service as Service;
    serviceInfo.name = req.body.service.name || serviceInfo.name;
    serviceInfo.description = req.body.service.description || serviceInfo.description;
    serviceInfo.picture = req.body.service.profileImage || serviceInfo.picture;
    serviceInfo.banner = req.body.service.bannerImage || serviceInfo.banner;
    serviceInfo.public_settings.allow_public_visibility = req.body.service.allow_public_visibility !== undefined ? req.body.service.allow_public_visibility : serviceInfo.public_settings.allow_public_visibility;

    const update: ReplyType = await services.service.global.update(serviceID, serviceInfo);
    await services.service.logs.create(serviceID, `Service public details (${Object.keys(req.body.service).join(", ")}) updated.`, "SETTINGS", "INFO", { user: user.id });

    return software.methods.directResponse(update.status, update.message, res, req);
}