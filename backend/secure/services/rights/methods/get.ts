import { Collection } from "mongoose";
import { db } from "../../../..";
import { ServiceRights } from "../../../../types/.types/tunneling.type";
import { services } from "../../dir";

export async function getRight(rightIDorName : string, service_id : string, type : ServiceRights["type"] | "ALL" = "ALL") : Promise<ServiceRights | null> {
    const serviceRightsDB = db.collection('service_rights') as Collection<ServiceRights>;
    const right = await serviceRightsDB.findOne({$or: [{id: rightIDorName}, {name: rightIDorName}], service_id: service_id, ...(type !== "ALL" ? { type: type } : {})});
    if (!right) return null;

    if (right.type === "TUNNELING_BY_INSTANCE") {
        const tunnels = await services.service.rights.getTunnels(right.id, service_id);
        right.tunnels = tunnels;
    }

    return right;
}