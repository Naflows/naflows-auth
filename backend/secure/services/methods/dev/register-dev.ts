import { db } from "../../../..";
import { software } from "../../../../software/dir";
import { ReplyType } from "../../../../types/.types/reply.type";
import secure from "../../../global/dir";
import crypto from 'crypto';



export async function registerServiceDev(service_id : string, developer_id : string) : Promise<ReplyType> {
    const serviceDevs = db.collection('service_devs');
    const existingDev = await serviceDevs.findOne({ service_id: service_id, developer_id: developer_id });

    if (existingDev) {
        return software.methods.serverReply(409, "Conflict: Developer is already registered for this service.");
    }

    const ins = await serviceDevs.insertOne({
        developer_id : secure.crypt(developer_id),
        service_id : service_id,
        created_at : Date.now(),
        updated_at : Date.now(),
        access_key : crypto.randomBytes(32).toString('hex')
    });

    if (!ins.acknowledged) {
        return software.methods.serverReply(500, "Internal Server Error: Failed to register developer.");
    }

    return software.methods.serverReply(201, "Developer registered successfully.");
}