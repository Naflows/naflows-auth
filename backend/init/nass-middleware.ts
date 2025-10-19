import { v4 } from "uuid";
import { services } from "../secure/services/dir";

export async function nassMiddleware(req, res, next)  {
    if (req.path.startsWith('/dev/')) {
        const apiID = req.body.apiID;
        if (apiID) {
            await services.service.logs.setTraffic(apiID, {
                endpoint: req.path,
                method: req.method,
                timestamp: Date.now(),
                type: "DEVELOPER",
                id: v4()
            });
        }
    }

    next();
}