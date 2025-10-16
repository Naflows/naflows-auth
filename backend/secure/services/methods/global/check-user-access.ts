import { User } from "../../../../types/.types/collections.type";
import { services } from "../../dir";


export async function checkUserAccess(req, res, user : User) {
    const { service_id } = req.body;
    if (!user) {
        return res.status(401).json({ success: false, message: "Unauthorized: User not found.", data : {
            middleware : req.middleware.data,
            status : 401,
            success:  false,
            message: "Unauthorized: User not found."
        } });
    }

    console.log("\x1b[33m%s\x1b[0m", `Checking access for user ${user.username} (ID: ${user.id}) to service ${service_id}.`);
    const isuserDev = await services.service.user.isDev(user.id, service_id);
    if (!isuserDev.success) {
        console.log("\x1b[31m%s\x1b[0m", `User ${user.username} (ID: ${user.id}) attempted to access service ${service_id} without sufficient permissions.`);
        return res.status(403).json({ success: false, message: "Forbidden: User does not have access to this service.", status : 403, data : {
            middleware : req.middleware.data,
            status : 403,
            success:  false,
            message: "Forbidden: User does not have access to this service."
        } });
    } else {
        console.log("\x1b[32m%s\x1b[0m", `User ${user.username} (ID: ${user.id}) accessed service ${service_id} successfully.`);
        return res.status(200).json({ success: true, message: "User has access to this service.", status : 200, data : {
            middleware : req.middleware.data,
            status : 200,
            success:  true,
            message: "User has access to this service."
        } });
    }
}