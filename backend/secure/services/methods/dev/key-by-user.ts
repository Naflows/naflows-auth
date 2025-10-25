import { Collection } from "mongoose";
import { db } from "../../../..";
import secure from "../../../global/dir";
import { DeveloperSecureAccess } from "../../../../types/.types/tunneling.type";


export async function getKeyByUser(userId: string, serviceId: string) : Promise<string | null> {
    const keys = db.collection("service_devs") as Collection<DeveloperSecureAccess>;
    const allKeys = await keys.find({ service_id: serviceId }).toArray();
    const userKey = allKeys.find(key => secure.verify(userId, key.developer_id));
    return userKey?.access_key || null;
}