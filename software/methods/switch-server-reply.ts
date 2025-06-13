import { ReplyType } from "../../types/reply.type";


export async function SwitchServerReply(
    rep : ReplyType,
    res : Response
) {
    switch (rep.status) {
        case 200:
            break;
        case 403:
            console.error("Forbidden: " + rep.message);

            break;
        case 500:
            console.error("Internal Server Error: " + rep.message);
            break;
    }
}