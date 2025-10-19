import { v4 } from "uuid";
import { software } from "../../../software/dir";
import { User } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import { services } from "../../services/dir";
import secure from "../dir";

const manageConnection = async (req, res): Promise<User> => {
    const userID = req.middleware.data.user_id;
    if (!userID) {
        res.status(401).json(software.methods.serverReply(401, "Unauthorized: No user ID in middleware data."));
    }
    const user = await secure.user.get(userID, false);
    if (!user) {
        res.status(404).json(software.methods.serverReply(404, "User not found."));
    }

    const serviceID = req.body.service_id;
    if (serviceID) {
        await services.service.logs.setTraffic(serviceID, {
            endpoint: req.path,
            method: req.method,
            timestamp: Date.now(),
            type: "DEVELOPER",
            id: v4()
        });
    }

    // Note : login is already managed in middleware !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    return user;
}

export default manageConnection;