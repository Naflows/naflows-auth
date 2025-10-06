import { services } from "../../dir";

export async function getLogsRoutes(req, res, user) {
    const serviceID = req.body.service_id;
    const offset = req.body.offset || 0;
    const limit = req.body.limit || 50;
    console.log("Request to get logs received for service ID:", serviceID, "by user:", user.username);
    const isUserDev = await services.service.user.isDev(user.id, serviceID);
    if (isUserDev.success) {
        const logs = await services.service.logs.get(serviceID, limit, offset);
        return res.status(200).json({
            status: 200,
            message: "Logs retrieved successfully.",
            success: true,
            data: {
                logs,
                middleware: req.middleware.data,
            }
        });
    }
    return res.status(403).json({
        status: 403,
        message: "You do not have permission to view logs for this service.",
    });
}