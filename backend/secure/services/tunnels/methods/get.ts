import { Service } from "ts-node";
import { db } from "../../../..";
import { type ServiceTunneling } from "../../../../types/.types/tunneling.type";
import { Collection } from "mongoose";


export async function getTunnel(service_id : string, route? : string | null) : Promise<ServiceTunneling | null> {
    const servicesCollection = db.collection("service_tunneling") as Collection<ServiceTunneling>;
    const tunnel : ServiceTunneling | null = await servicesCollection.findOne({ service_id : service_id, target_url : route || null });
    return tunnel;
}