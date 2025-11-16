import { Collection } from "mongoose";
import { db } from "../../../..";
import { ServiceTunneling } from "../../../../types/.types/tunneling.type";


export async function getTunnelsByRight(rightID: string, service_id: string) : Promise<ServiceTunneling[] | null> {
    const servicesCollection = db.collection("service_tunneling") as Collection<ServiceTunneling>;
    const tunnels : ServiceTunneling[] = await servicesCollection.find({ service_id : service_id, 
        // allowed_rights contains rightID but can contain other rights as well: make sure to use $in
        allowed_rights: { $in: [rightID] }
     }).toArray();
    return tunnels.length > 0 ? tunnels : null;
}