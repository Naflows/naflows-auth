
// This function gets all NASS authorizations for dev in order to allow visual representation of what the developer can access in the frontend

import { services } from "../../dir";


export async function NassAuthorForDev(devID : string, serviceId : string) : Promise<Record<string,boolean>> {
    const devRights = await services.service.user.getRights(devID, serviceId);
    
    if (!devRights) {
        return {};
    }

    const associatedRights: Record<string, boolean> = {};
    for (const right of devRights) {
        const r = await services.service.rights.get(right.id, serviceId, "SERVICE_BY_NASS");
        if (right) {
            right.rights.forEach((r) => {
                associatedRights[r] = true;
            })
        }
    }
    return associatedRights;
}