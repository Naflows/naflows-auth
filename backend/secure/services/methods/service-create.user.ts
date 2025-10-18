import { Collection } from "mongoose";
import { software } from "../../../software/dir";
import { Service, ServicePlan, ServiceSettings } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import secure from "../../global/dir";
import { db } from "../../..";
import { services } from "../dir";

/*

    This function is used to create a service. Any user can create a service.

*/

export async function createService(userID : string, password : string, identifier: string, details : {
    name : string,
    description : string | null,
    storagePlan : ServicePlan,
    ip_address : string,
    dns : string,
    settings : ServiceSettings
}) : Promise<ReplyType> {

    if ((await secure.user.credentials(userID, password, identifier))) {
        const servicesCollection : Collection<Service> = await db.collection("services");

        if (!servicesCollection) return software.methods.serverReply(500, "Internal Server Error: Services collection not found.");

        const userServices : Array<Service> = await servicesCollection.find({ userID }).toArray();

        // TODO: Implement rates for plans
        const sameServices = userServices.find((s : Service) => s.name === details.name || s.ip_address.includes(details.ip_address) || s.dns === details.dns);

        if (sameServices) {
            return software.methods.serverReply(409, "Conflict: Service with same name, IP address or DNS already exists.");
        }

        //const service : ReplyType = await services.service.register(details.name, details.description, userID, details.storagePlan, details.ip_address, details.dns, details.settings);

        // if (!service.success) return service;
        // else {
        //     return software.methods.serverReply(201, "Service created successfully.", service.data);
        // }

        await services.service.logs.create("SYSTEM", `Service creation initiated`, "SYSTEM", "INFO", { user: userID, serviceName: details.name });

    } else {
        return software.methods.serverReply(401, "Unauthorized: Invalid credentials.");
    }

}