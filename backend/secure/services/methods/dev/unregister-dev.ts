import { Collection } from "mongoose";
import { db } from "../../../..";
import { software } from "../../../../software/dir";
import { DeveloperSecureAccess } from "../../../../types/.types/tunneling.type";
import secure from "../../../global/dir";
import { ReplyType } from "../../../../types/.types/reply.type";
import { services } from "../../dir";
import { User } from "../../../../types/.types/collections.type";


export async function unregisterDev(service_id : string, developer_id : string, author?: User) : Promise<ReplyType> {

    const service = await services.service.get(service_id);
    if (!service.success) {
        return software.methods.serverReply(404, "Not Found: Service does not exist.");
    }

    if (service.data.service.created_by == developer_id) {
        return software.methods.serverReply(400, "Bad Request: Service creator cannot be unregistered as developer.");
    }


    const serviceDevs = db.collection('service_devs') as Collection<DeveloperSecureAccess>;
    const existingDevs = await serviceDevs.find({ service_id: service_id}).toArray() as DeveloperSecureAccess[];
    // Note: developer_id is encrypted in the database, so we only check by service_id here.
    
    if (!existingDevs) {
        return software.methods.serverReply(404, "Not Found: Developer is not registered for this service.");
    }

    for (const existingDev of existingDevs) {
        if (secure.verify(developer_id, existingDev.developer_id)) {
            // Found the matching developer
            const del = await serviceDevs.deleteOne({ id: existingDev.id });
            
            if (del.deletedCount === 0) {
                return software.methods.serverReply(500, "Internal Server Error: Failed to unregister developer.");
            }
        }
    }

    const user = await secure.user.get(developer_id, false);
    if (user && author) {
        await services.service.logs.create(service_id, `Unregistered developer (${user.username})`, "DEVELOPERS", "WARNING", {
            user: author.id,
            message : `Developer ${user.username} (${developer_id}) was unregistered from service ${service.data.service.name} (${service_id}) by ${author.username}`
        });
    }




    return software.methods.serverReply(200, "Developer unregistered successfully.");
}