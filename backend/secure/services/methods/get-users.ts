import { Collection } from "mongoose";
import { db } from "../../..";
import { ReplyType } from "../../../types/.types/reply.type";
import { ServiceRights, UserRights } from "../../../types/.types/tunneling.type";
import { User } from "../../../types/.types/collections.type";
import secure from "../../global/dir";
import { software } from "../../../software/dir";
import { services } from "../dir";
import { profile } from "console";
import getPicture from "../../../software/data-management/get-picture";


export async function getServiceUsers(serviceId : string, user_id : string) : Promise<ReplyType> {
    const userRightsCollection = db.collection("user_rights") as Collection<UserRights>;
    const usersCollection = db.collection("users") as Collection<User>;

    const usersRights = await userRightsCollection.find({ service_id: serviceId }).toArray();

    const usersData = [];

    for (const userRight of usersRights) {
        const user = await secure.user.get(userRight.user_id, false) as User | null;
        const rights = userRight.rights;
        const rightsNames = [];
        for (const rightId of rights) {
            const right = await services.service.rights.get(rightId, serviceId, "ALL") as ServiceRights | null;
            if (right) {
                console.log(` FOund right ${right.name} for user ${userRight.user_id}`);
                rightsNames.push({
                    id : right.id,
                    name : right.name,
                    hue : right.hue,
                    description : right.description,
                    type : right.type
                });
            }
        }
        if (user) {
            usersData.push({
                id: user.id,
                username: user.username,
                email: user.email,
                joined_on : userRight.created_at,
                last_updated : userRight.updated_at,
                rights: rightsNames,
                profile_picture: await getPicture(user.profile_picture ?? "", "user"),
                you : user.id === user_id,
                you_can_manage : await services.service.user.canManageUserInService(user_id, user.id, serviceId)
            });
        }
    }

    // Order users by joined_on date descending
    usersData.sort((a, b) => b.joined_on - a.joined_on);

    return software.methods.serverReply(200, "Service users retrieved successfully.", {
        serviceUsers: usersData
    });
}