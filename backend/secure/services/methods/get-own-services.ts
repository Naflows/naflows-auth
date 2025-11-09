import { db } from "../../..";
import { software } from "../../../software/dir";
import { ReplyType } from "../../../types/.types/reply.type";
import { services } from "../dir";


export async function getUserServices(userID: string, compact: boolean = false): Promise<ReplyType> {
    const serviceCollection = db.collection("services");
    const userServiceRights = db.collection("user_rights");

    if (!serviceCollection || !userServiceRights) {
        return software.methods.serverReply(500, "Internal server error. Collections not found.");
    }

    const userRights = await userServiceRights.find({ user_id: userID }).toArray();

    const s = await Promise.all(userRights.map(async (ur) => {
        const service = await serviceCollection.findOne({ id: ur.service_id });
        if (service) {
            const isUserDeveloper = (await services.service.user.isDev(userID, service.id)).success;

            if (compact) {
                return {
                    name: service.name,
                    id: service.id,
                    description: service.description,
                    dns: service.dns,
                    status: service.status,
                    rights: ur.rights,
                    joined_at: ur.joined_at,
                    user_active: ur.active,
                    picture: service.picture,
                    banner: service.banner,
                    details: service.details,
                    is_user_developer: isUserDeveloper,
                }
            } else {
                return {
                    ...service,
                    user_rights: ur.rights,
                    joined_at: ur.joined_at,
                    user_active: ur.active,
                    is_user_developer: isUserDeveloper,
                };
            }
        }
    }));

    return software.methods.serverReply(200, "User services retrieved successfully.", {
        services: s.filter(s => s !== null)
    });
}