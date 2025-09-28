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
import { Service, ServiceSettings, ServiceToken } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import { software } from "../../../software/dir";
import { services } from "../dir";
import { db } from "../../..";
import { Collection } from "mongoose";
import secure from "../../global/dir";
import { ServicePlan } from "./get-plans";

export async function registerService(
    // These data are the one defined by the user creating the service
    pub: {
        name: string, description: string | null, picture, banner, ip_address: string, dns: string, id: string
    }, settings: {
        rates: 100 | 500 | 1000 | 10000;
    },
    public_settings: {
        allow_public_visibility: boolean;
        allow_user_registration: boolean;
    }, plan: {
        id: number,
    }, req, res
): Promise<ReplyType> {

    const serviceCollection: Collection<Service> = db.collection("services");

    // Check if the service id, name, ip address or dns already exists
    const existingService: Service | null = await serviceCollection.findOne({
        $or: [
            { id: pub.id },
            { name: pub.name },
            { ip_address: pub.ip_address },
            { dns: pub.dns }
        ]
    });

    if (existingService) {
        return software.methods.serverReply(409, "Conflict: Service with same ID, name, IP address or DNS already exists.");
    }


    const user = await secure.user.manageConnection(req, res);

    if (!user) {
        return software.methods.serverReply(401, "Unauthorized: User not found.");
    }

    const plans = await services.service.getPlans() as ReplyType;

    if (!plans.success) {
        return software.methods.serverReply(500, "Internal Server Error: Failed to fetch service plans.");
    }

    const data = plans.data as { plans: ServicePlan[] };
    console.log(data.plans, "PLANS", "for", plan.id);
    const planData = data.plans.find((p: ServicePlan) => p.id === plan.id);

    if (!planData) {
        return software.methods.serverReply(404, "Not Found: Service plan not found.");
    }

    const service: Service = {
        id: pub.id,
        name: pub.name,
        description: pub.description,

        created_by: user.id,

        ip_address: pub.ip_address,
        dns: pub.dns,
        service_token: 'unavailable',
        created_at: new Date().getTime(),
        status: "INACTIVE",

        picture: pub.picture,
        banner: pub.banner,

        settings: {
            rates: settings.rates,
            allow_nass_payement_method: false
        },

        plan: {
            plan: planData.name,
            type: planData.type,
            size: planData.storage,
            used_space: 0
        },

        public_settings: {
            allow_public_visibility: public_settings.allow_public_visibility,
            allow_user_registration: public_settings.allow_user_registration,
            allow_service_connection: false,
            required_data: []
        },

        details: {
            users: 1, // The creator is the first user
            public: {
                privacy_policy_url: "null",
                terms_of_service_url: "null",
                contact_email: "null",
            }
        }
    };

    const token: ReplyType = await services.token.new(service.id, "AUTO");

    if (!token) software.methods.serverReply(500, "Internal Server Error: Failed to generate service token.");

    service.service_token = (token.data as ServiceToken).token;

    await serviceCollection.insertOne(service);


    const u = await services.service.user.register(user, service.id, null, true, ["ADMINISTRATOR"]);

    if (!u.success) return software.methods.serverReply(500, "Internal Server Error: Failed to register service owner as user of the service.");

    try {
        return software.methods.serverReply(200, "Service registered successfully.");

    } catch (error) {
        software.methods.serverReply(500, "Internal Server Error: Failed to register service.");
    }

}