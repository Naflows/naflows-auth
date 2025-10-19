import { services } from "../../../../secure/services/dir";
import { software } from "../../../../software/dir";
import { APIKey, Service } from "../../../../types/.types/collections.type";
import { ReplyType } from "../../../../types/.types/reply.type";
import { ServiceRights, UserRights } from "../../../../types/.types/tunneling.type";



export async function checkIncomingDevData(apiKey : string, apiID : string, devKey : string, needed_rights : ServiceRights["rights"]) : Promise<ReplyType> {
    if (!apiKey || !apiID) {
        return software.methods.serverReply(400, "apiKey and apiID are required.");
    }

    const serviceRT: ReplyType = await services.service.get(apiID);
    if (!serviceRT.success) {
        return software.methods.serverReply(404, "Service not found.");
    }

    const keyRT: ReplyType = await services.service.key.getByApi(apiID);
    if (!keyRT.success) {
        return software.methods.serverReply(404, "API Key not found for this service.");
    }

    const service = serviceRT.data as Service;
    const key = keyRT.data.key as APIKey;

    if (key.key !== apiKey) {
        console.log("[initInstance] Invalid API Key provided.");
        return software.methods.serverReply(403, "Invalid API Key.");
    }
    if (key.expiresAt < Date.now()) {
        console.log("[initInstance] API Key has expired.");
        return software.methods.serverReply(403, "API Key has expired.");
    }



    if (service.status !== "ACTIVE") {
        console.log("[initInstance] Service is not active.");
        return software.methods.serverReply(403, "Service is not active.");
    }

    const userRT: ReplyType = await services.service.dev.getUserByKey(devKey);
    if (!userRT.success) {
        return software.methods.serverReply(userRT.status, userRT.message || "Developer access key is invalid.");
    }

    const userRightsValue : ServiceRights[] = await services.service.user.getRights(userRT.data?.user.id, apiID,true,"SERVICE_BY_NASS");


    if (userRightsValue.length === 0) {
        return software.methods.serverReply(403, "Developer does not have any rights in this service.");
    }

    const userRights = userRightsValue.flatMap(ur => ur.rights);
    const hasAllNeededRights = needed_rights.every(right => userRights.includes(right));


    console.log("User rights for developer:", userRightsValue);
    console.log("Needed rights:", needed_rights);
    console.log("Has all needed rights:", hasAllNeededRights);

    if (!hasAllNeededRights) {
        return software.methods.serverReply(403, "Developer does not have the required rights.");
    }
    

    return software.methods.serverReply(200, "Developer data is valid.", { service, user: userRT.data?.user });
}