import { v4 } from "uuid";
import { ReplyType } from "../../../types/.types/reply.type";
import { services } from "../dir";
import { software } from "../../../software/dir";

export async function generateApiID(): Promise<ReplyType> {
    const apiID = `${v4()}${new Date().getTime()}`;

    // Check if the API ID already exists in the database
    const API = await services.service.get(apiID);
    if (API.success) {
        return generateApiID();
    }

    return software.methods.serverReply(200, "API ID generated successfully.", { key: apiID });
}