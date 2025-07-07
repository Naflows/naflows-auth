import { returnReplyType } from "./methods/return-replytype";
import { SwitchServerReply } from "./methods/switch-server-reply";


export const software = {
    methods : {
        manageErrorCode : SwitchServerReply,
        serverReply : returnReplyType
    }
}