import { Collection } from "mongoose";
import { db } from "../../../..";
import { ServiceRights } from "../../../../types/.types/tunneling.type";

export async function getRight(rightID : string, service_id : string) : Promise<ServiceRights | null> {
    const serviceRightsDB = db.collection('service_rights') as Collection<ServiceRights>;
    const right = await serviceRightsDB.findOne({id: rightID, service_id: service_id});
    if (!right) return null;
    return right;
}