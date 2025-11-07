import { Collection } from "mongoose";
import { db } from "../../..";
import { ReplyType } from "../../../types/.types/reply.type";
import { ServiceRights, UserRights } from "../../../types/.types/tunneling.type";
import { User } from "../../../types/.types/collections.type";
import secure from "../../global/dir";
import { software } from "../../../software/dir";
import { services } from "../dir";
import { profile } from "console";


export async function getServiceUsers(serviceId : string) : Promise<ReplyType> {
    const userRightsCollection = db.collection("user_rights") as Collection<UserRights>;
    const usersCollection = db.collection("users") as Collection<User>;

    const usersRights = await userRightsCollection.find({ service_id: serviceId }).toArray();

    const usersData = [];

    for (const userRight of usersRights) {
        const user = await usersCollection.findOne({ id: userRight.user_id });
        const rights = userRight.rights;
        const rightsNames = [];
        for (const rightId of rights) {
            const right = await services.service.rights.get(rightId, serviceId) as ServiceRights | null;
            if (right) {
                rightsNames.push({
                    id : right.id,
                    name : right.name,
                    hue : right.hue,
                    description : right.description
                });
            }
        }
        if (user) {
            usersData.push({
                id: user.id,
                username: user.username,
                email: user.email,
                rights: rightsNames,
                profile_picture: user.profile_picture,
            });
        }
    }



    return software.methods.serverReply(200, "Service users retrieved successfully.", {
        serviceUsers: usersData
    });
}