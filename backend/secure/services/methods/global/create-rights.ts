import { Request, Response } from "express";
import { User } from "../../../../types/.types/collections.type";
import { services } from "../../dir";
import { software } from "../../../../software/dir";


export async function createRights(req: Request, res: Response, user: User) {
    const {
        service_id,
        name,
        type,
        deletable,
        rights,
        description
    } = req.body;

    const isUserDev = (await services.service.user.isDev(user.id, service_id)).success || await services.service.user.hasRight(user.id, service_id, "MANAGE_RIGHTS");
    if (!isUserDev) {
        return software.methods.directResponse(403, "Forbidden: User does not have permission to create rights.", res, req);
        return;
    }


    const re = await services.service.rights.create(service_id, name, description, rights, deletable, type, user.id);
    if (re.success) {
        return software.methods.directResponse(200, "Rights set created successfully.", res, req);
    } else {
        return software.methods.directResponse(re.status, re.message || "Failed to create rights set.", res, req);
    }

}