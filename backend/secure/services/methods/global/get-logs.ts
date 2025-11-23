import { software } from "../../../../software/dir";
import { services } from "../../dir";

export async function getLogsRoutes(req, res, user) {
    const serviceID = req.body.service_id;
    const offset = req.body.offset || 0;
    const limit = req.body.limit || 50;


    const filters = req.body.filters || {};
    console.log("Request to get logs received for service ID:", serviceID, "by user:", user.username);
    const isUserDev = (await services.service.user.isDev(user.id, serviceID)).success || await services.service.user.hasRight(user.id, serviceID, "VIEW_LOGS");
    if (isUserDev) {
        const logs = await services.service.logs.get(serviceID, limit, offset, filters);

        return software.methods.directResponse(200, "Logs retrieved successfully.", res, req, {
            logs : logs.logs,
            total : logs.total,
            tabs : logs.tabs
        });
    }

    return software.methods.directResponse(403, "You do not have permission to view logs for this service.", res, req);
}