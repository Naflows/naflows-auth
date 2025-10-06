import { db } from "../../../..";
import { software } from "../../../../software/dir";
import { ReplyType } from "../../../../types/.types/reply.type";


export async function devLogin(service_id: string, developer_access_key: string): Promise<ReplyType> {
    const serviceDevs = db.collection('service_devs');
    const existingDevs = await serviceDevs.find({ service_id: service_id }).toArray();

    const devAccessKey = existingDevs.find((dev: any ) => dev.access_key === developer_access_key);

    if (!devAccessKey) {
        return software.methods.serverReply(403, "User is not a developer for this service.");
    }

    return software.methods.serverReply(200, "Developer has access to the service.");

}