import { software } from "../../../../software/dir";
import { ReplyType } from "../../../../types/.types/reply.type";
import secure from "../../../global/dir";
import { services } from "../../dir";


export async function getUserByKey(apiKey: string) : Promise<ReplyType> {
    const devKey = await services.service.user.getKeyByValue(apiKey);
    if (!devKey.success) {
        console.log(">>>>> Developer key not found for apiKey:", apiKey)
        return software.methods.serverReply(403, "Developer key not found.");
    }
    console.log(">>>>> Developer key found:", devKey.data?.devKey);
    const user = await secure.user.get(devKey.data.devKey.developer_id,true);
    if (!user) {
            console.log(">>>>> Developer not found for developer_id:", devKey.data.devKey.developer_id)
        return software.methods.serverReply(403, "Developer not found.");
    }

    return software.methods.serverReply(200, "Developer found.", { devKey: devKey.data.devKey, user: user });
}