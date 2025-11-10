import { Collection } from "mongoose";
import { db } from "../../../..";
import { ServiceRights, UserRights } from "../../../../types/.types/tunneling.type";
import secure from "../../../global/dir";
import { services } from "../../dir";

export async function getAllRights(service_id: string): Promise<ServiceRights[]> {
    const serviceRightsDB = db.collection('service_rights') as Collection<ServiceRights>;
    const userRightsDB = db.collection('user_rights') as Collection<UserRights>;

    const rights = await serviceRightsDB.find({ service_id: service_id }).toArray();
    const userRightsArray = await userRightsDB.find({ service_id: service_id }).toArray() as UserRights[];

    const rightsSet = new Set(rights.map(r => r.id));
    const usersPerRights: { [key: string]: { id: string; username: string; first_name: string; last_name: string; profile_picture: string | null }[] } = {};

    for (const ur of userRightsArray) {
        await Promise.all(
            ur.rights.map(async (rID) => {
                if (rightsSet.has(rID)) {
                    const user = await secure.user.get(ur.user_id, false);
                    if (user) {
                        if (!usersPerRights[rID]) {
                            usersPerRights[rID] = [];
                        }
                        if (!usersPerRights[rID].some(u => u.id === user.id)) {
                            usersPerRights[rID].push({
                                id: user.id,
                                username: user.username,
                                first_name: user.first_name,
                                last_name: user.last_name,
                                profile_picture: user.profile_picture
                            });
                        }
                    }
                }
            })
        );
    }

    for (const right of rights) {
        right.usersPerRights = usersPerRights[right.id] || [];
    }

    // Order rights by their 'order' field, 1 being the highest priority
    rights.sort((a, b) => a.order - b.order);


    return rights;
}