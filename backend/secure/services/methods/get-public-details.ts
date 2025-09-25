import { software } from "../../../software/dir";
import { Service, User } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import secure from "../../global/dir";
import { services } from "../dir";



export async function getPublicServiceDetails(id: string, userId: string | null): Promise<ReplyType> {
    const serviceData: ReplyType = await services.service.get(id);

    if (!serviceData.success) {
        return serviceData;
    }

    const service = serviceData.data as Service;

    delete service.ip_address;
    delete service.plan;
    delete service.settings;
    delete service.service_token;
    delete service.public_settings.allow_public_visibility;
    delete service.public_settings.allow_user_registration;
    delete service.public_settings.allow_service_connection;

    console.log("User ID:", userId);
    service.details.user_is_registered = await services.service.user.isIn(id, userId || "");


    console.log("Service created by ", service.created_by);
    const owner: User = await secure.user.get(service.created_by, false) as User;
    if (owner) {
        service.details.owner = {
            username: owner.username,
            profile_picture: owner.profile_picture,
            verified: owner.phone_verified && owner.email_verified,
            first_name: owner.first_name,
            last_name: owner.last_name,
        }
    }
    delete service.created_by;

    return software.methods.serverReply(200, "Public service details fetched successfully.", service);

}