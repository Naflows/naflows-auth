import { Request, Response } from "express";
import { User } from "../../../../types/.types/collections.type";
import { software } from "../../../../software/dir";
import { services } from "../../dir";

export async function getTrafficLogRoute(req: Request, res: Response, user: User): Promise<void> {
    const serviceID = req.body.service_id;
    const isUserDev = await services.service.user.isDev(user.id, serviceID);
    if (isUserDev.success) {
        const traffic = await services.service.logs.getTraffic(serviceID);

        const service = await services.service.get(serviceID);
        if (!service.success || !service.data?.service) {
            return software.methods.directResponse(404, "Service not found.", res, req);
        }

        const serviceData = service.data.service;
        const requests = traffic.data.trafficLog.requests;
 

        const maxRate = (await services.service.plan.get(serviceData.plan)).RPS * 1.5;
        const oneMinuteAgo = Date.now() - 60000;
        const recentRequests = requests.filter(req => req.timestamp >= oneMinuteAgo);
        const rps = recentRequests.length; // requests per second

        return software.methods.directResponse(200, "Traffic retrieved successfully.", res, req, {
            traffic : traffic.data.trafficLog,
            maxRate : maxRate,
            overwhelmed : rps > maxRate,
            rps : rps
        });
    }

    return software.methods.directResponse(403, "You do not have permission to view traffic for this service.", res, req);

}