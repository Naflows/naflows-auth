import { db } from "../../../..";
import { software } from "../../../../software/dir";
import { ReplyType } from "../../../../types/.types/reply.type";
import secure from "../../../global/dir";


export async function isDevFromService(developer_id: string, service_id: string): Promise<ReplyType> {

    if (!developer_id || !service_id) {
        return software.methods.serverReply(400, "Bad Request: Missing developer_id or service_id.");
    }

    const serviceDevs = db.collection('service_devs');
    const existingDevs = await serviceDevs.find({ service_id: service_id }).toArray();

    const devAccessKey = existingDevs.find((dev: any) => secure.verify(developer_id, dev.developer_id))?.access_key;

    if (!devAccessKey) {
        return software.methods.serverReply(403, "Invalid developer access key.");
    }

    return software.methods.serverReply(200, "Developer has access to the service.", { access_key: devAccessKey });

}