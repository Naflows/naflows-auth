/*

    This functions aims to register a service as well as everything related to it in the database. This includes:
    * Service default values
    * Service tokens
    * Service details

    Please note that this function DOES NOT EXECUTE ANY RIGHTS MANAGEMENT LOGIC, which means it will not control wether the service can be registered or not. 

    This function is also not responsible for validating the service data before registration. It is assumed that the data passed to this function is already validated and sanitized.

    This function should be used in the NASS with caution and compliance to the relevant regulations and policies in order to prevent any potential security risks or data breaches, as well as unintended behaviors.

*/

import { v4 } from "uuid";
import { Service, ServiceSettings, ServiceStoragePlan, ServiceToken } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import { software } from "../../../software/dir";
import { services } from "../dir";
import { db } from "../../..";
import { Collection } from "mongoose";

export async function registerService(
    // These data are the one defined by the user creating the service
    name: string, description: string | null, owner_id: string, storagePlan: ServiceStoragePlan, ip_address: string, dns: string, settings: ServiceSettings
): Promise<ReplyType> {

    const serviceCollection : Collection<Service> = db.collection("services");

    const service: Service = {
        id: `${v4()}-${new Date().getTime()}`,
        name,
        description,
        created_by: owner_id,
        storage: {
            plan: storagePlan.plan,
            type: storagePlan.type,
            size: storagePlan.size
        },
        ip_address,
        dns: dns,
        service_token: 'unavailable',
        created_at: new Date().getTime(),
        status: "INACTIVE",
        settings: {
            rates: settings.rates || 100,
        }
    };

    const token: ReplyType = await services.token.new(service.id, "AUTO");

    if (!token) software.methods.serverReply(500, "Internal Server Error: Failed to generate service token.");

    service.service_token = (token.data as ServiceToken).token;

    try {
        await serviceCollection.insertOne(service);
        return software.methods.serverReply(200, "Service registered successfully.", service);

    } catch (error) {
        software.methods.serverReply(500, "Internal Server Error: Failed to register service.");
    }

}