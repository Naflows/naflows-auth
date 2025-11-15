import { db } from "../../../..";
import { software } from "../../../../software/dir";


export async function getDevKeyByValue(key : string) {
    const serviceDevs = db.collection('service_devs');
    const allDevs = await serviceDevs.find({}).toArray();
    const dev = allDevs.find(d => d.access_key === key);
    if (!dev) {
        return software.methods.serverReply(404, "Developer Key not found.");
    }

    return software.methods.serverReply(200, "Developer Key found.", { devKey: dev });
}