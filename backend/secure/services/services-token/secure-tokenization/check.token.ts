import { Collection } from "mongoose";
import { Service, Tokens } from "../../../../types/.types/collections.type";
import { db } from "../../../..";
import secure from "../../../global/dir";
import { services } from "../../dir";



export default async function checkServiceToken(
    serviceID : string,
    token : string,
    creation_date : number
) : Promise<boolean> {
    const tokens : Collection<Tokens> = db.collection('service_tokens');

    console.log(`Checking token for service: ${serviceID} with value ${token} ${creation_date}`);

    const service : Service = await services.service.get(serviceID).then(res => res.data as Service);

    if (!service) {
        console.log(`Service with ID ${serviceID} not found.`);
        return false;
    }

    console.log(`Service found: ${JSON.stringify(service)}`);

    const _token : Tokens = await tokens.findOne({
        service_id : service.id,
        created_at : creation_date
    }) as Tokens;

    console.log(`Token found: ${JSON.stringify(_token)}`);
    const isValid = _token && secure.verify(token, _token.token);

    if (!isValid) {
        return false;
    }


    return true;
}