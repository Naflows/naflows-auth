import { software } from "../../../../software/dir";
import { User } from "../../../../types/.types/collections.type";
import { services } from "../../dir";


export async function checkUserAccess(req, res, user : User) {
    const { service_id } = req.body;
    if (!user) {
        return software.methods.directResponse(401, "Unauthorized: User not found.", res, req);
    }

    console.log("\x1b[33m%s\x1b[0m", `Checking access for user ${user.username} (ID: ${user.id}) to service ${service_id}.`);
    const isuserDev = await services.service.user.isDev(user.id, service_id);
    if (!isuserDev.success) {
        console.log("\x1b[31m%s\x1b[0m", `User ${user.username} (ID: ${user.id}) attempted to access service ${service_id} without sufficient permissions.`);
        return software.methods.directResponse(403, "Forbidden: User does not have access to this service.", res, req);
    } else {
        console.log("\x1b[32m%s\x1b[0m", `User ${user.username} (ID: ${user.id}) accessed service ${service_id} successfully.`);
        return software.methods.directResponse(200, "User has access to this service.", res, req);
    }
}