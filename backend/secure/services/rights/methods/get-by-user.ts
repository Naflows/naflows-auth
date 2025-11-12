import { Collection } from "mongoose";
import { ServiceRights, UserRights } from "../../../../types/.types/tunneling.type";
import { db } from "../../../..";
import secure from "../../../global/dir";
import { services } from "../../dir";

export async function getRightsByUser(user_id : string, service_id : string, sendRightsValue : boolean = false, type : ServiceRights["type"] | "ALL" = "ALL") : Promise<ServiceRights[]> {
    const userRightsDB = db.collection('user_rights') as Collection<UserRights>;
    const AllUserRights = await userRightsDB.find({service_id: service_id}).toArray();
    const userRights = AllUserRights.find((ur : UserRights) => ur.user_id === user_id);

    console.log("User rights for user", user_id, "in service", service_id, ":", userRights);

    if (!userRights) {
        return [];
    }


    // Go throught userRights.rights and fetch the corresponding ServiceRights documents
    const rights = [];
    for (const right of userRights.rights) {
        const rightContent : ServiceRights = await services.service.rights.get(right, service_id, type);
        console.log("Fetched right content for right ID", right, ":", rightContent);
        if (rightContent) {
            rights.push({
                id: rightContent.id,
                name: rightContent.name,
                hue: rightContent.hue,
                rights : sendRightsValue ? rightContent.rights : [],
                description: rightContent.description,
                created_at: rightContent.created_at,
                updated_at: rightContent.updated_at,
                created_by: rightContent.created_by,
                can_edit: rightContent.can_edit || false,
                order: rightContent.order
            });
        }
    }



    return rights;
}