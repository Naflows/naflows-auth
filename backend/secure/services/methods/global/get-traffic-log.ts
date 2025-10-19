import { Request, Response } from "express";
import { User } from "../../../../types/.types/collections.type";
import { software } from "../../../../software/dir";
import { services } from "../../dir";

export async function getTrafficLogRoute(req: Request, res: Response, user: User): Promise<void> {
    const serviceID = req.body.service_id;
    const isUserDev = await services.service.user.isDev(user.id, serviceID);
    if (isUserDev.success) {
        const traffic = await services.service.logs.getTraffic(serviceID);


        return software.methods.directResponse(200, "Traffic retrieved successfully.", res, req, {
            traffic 
        });
    }

    return software.methods.directResponse(403, "You do not have permission to view traffic for this service.", res, req);

}