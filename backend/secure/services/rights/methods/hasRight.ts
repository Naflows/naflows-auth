import { Collection } from "mongoose";
import { db } from "../../../..";
import { ServiceRights } from "../../../../types/.types/tunneling.type";

// This function is used for NASS internal checks to verify if a user has a specific right for a service - do not use in NASS API

export async function userHasRight(userID: string, serviceID: string, rightName: "MANAGE_TUNNELS" | "MANAGE_DEVS" | "VIEW_STATS" | "READ" | "WRITE" | "DELETE" | "MANAGE_USERS" | "MANAGE_RIGHTS" | "MANAGE_SERVICE" | "MANAGE_SETTINGS" | "VIEW_USERS" | "VIEW_RIGHTS" | "VIEW_SERVICE" | "VIEW_SETTINGS" | "DEV_TOKEN_CREATION" | "PROD_TOKEN_CREATION" | "VIEW_LOGS" | "MANAGE_RIGHTS"): Promise<boolean> {
    const userRightsDB = db.collection('user_rights');

    const userRights = await userRightsDB.findOne({ user_id: userID, service_id: serviceID });
    if (!userRights) {
        return false;
    }

    const rightIDs = userRights.rights;

    const rightsDB = db.collection('service_rights') as Collection<ServiceRights>;

    const right = await rightsDB.findOne({ id: { $in: rightIDs }, service_id: serviceID,
        rights : { $in: [rightName] }
    }) as ServiceRights | null;

    console.log(`Found right for user ${userID} in service ${serviceID}:`, right);

    return right !== null;
    

}