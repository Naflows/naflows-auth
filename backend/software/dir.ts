import { directServerResponse } from "./methods/direct-server-response";
import getRoutesRights from "./methods/get-routes-rights";
import { returnReplyType } from "./methods/return-replytype";
import { SwitchServerReply } from "./methods/switch-server-reply";


export const software = {
    methods : {
        manageErrorCode : SwitchServerReply,
        serverReply : returnReplyType,
        getRoutesRights : getRoutesRights,
        directResponse :directServerResponse
    }
}