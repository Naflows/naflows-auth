import { software } from "../../../software/dir";
import { UserSession } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import querystring from "querystring";
import secure from "../dir";


export async function hiddenLogin(cookiesHeader : string, service : string) : Promise<ReplyType> {
    const cookies = querystring.parse(cookiesHeader.replace(/; /g, '&'));
    if (!cookies['session'] || !cookies['token']) {
        return software.methods.serverReply(401, "Unauthorized: Missing session or token.", false);
    }

    const session : UserSession = await secure.session.get(cookies['session'] as string, true);
    if (!session) {
        return software.methods.serverReply(401, "Unauthorized: Invalid session.", false);
    }

    const token = await secure.token.get(cookies['token'] as string, true);
    if (!token) {
        return software.methods.serverReply(401, "Unauthorized: Invalid token.", false);
    }



}