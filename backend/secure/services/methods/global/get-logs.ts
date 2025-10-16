import { software } from "../../../../software/dir";
import { services } from "../../dir";

export async function getLogsRoutes(req, res, user) {
    const serviceID = req.body.service_id;
    const offset = req.body.offset || 0;
    const limit = req.body.limit || 50;
    console.log("Request to get logs received for service ID:", serviceID, "by user:", user.username);
    const isUserDev = await services.service.user.isDev(user.id, serviceID);
    if (isUserDev.success) {
        const logs = await services.service.logs.get(serviceID, limit, offset);


        return software.methods.directResponse(200, "Logs retrieved successfully.", res, req, {
            logs
        });
    }

    return software.methods.directResponse(403, "You do not have permission to view logs for this service.", res, req);
}