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
import { Service, ServiceStoragePlan } from "../../types/.types/collections.type";
import { ReplyType } from "../../types/.types/reply.type";

export async function registerService(
    // These data are the one defined by the user creating the service
    name : string, description : string | null, owner_id : string, storagePlan : ServiceStoragePlan, ip_address : string, dns : string
) : Promise<ReplyType> {
    
    const service : Service = {
        id : `${v4()}-${new Date().getTime()}`,
        name : name,
        description : description,
        created_by : owner_id,
        storage : storagePlan,
        ip_address : ip_address,
        dns : dns,
        service_token : 'unavailable',
        created_at : new Date().getTime(),
        status : "INACTIVE"
    };

    return {
        status : 200,
        success : true,
        message : "Successfully registered service."
    }
}