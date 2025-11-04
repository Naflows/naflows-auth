import { ReplyType } from "../../types/.types/reply.type";
import { Response } from "express";


export async function SwitchServerReply(
    rep : ReplyType,
    res : Response
) {
    switch (rep.status) {
        case 200:
            break;
        case 401:
            console.error('\x1b[31m%s\x1b[0m',"Unauthorized: " + rep.message);
            break;
        case 403:
            console.error('\x1b[31m%s\x1b[0m',"Forbidden: " + rep.message);
            break;
        case 409:
            console.error('\x1b[31m%s\x1b[0m',"Conflict: " + rep.message);
            break;
        case 429:
            console.error('\x1b[31m%s\x1b[0m',"Too Many Requests: " + rep.message);
            break;
        case 500:
            console.error('\x1b[31m%s\x1b[0m',"Internal Server Error: " + rep.message);
            break;
    }
    if (!rep.success) {
        console.log('\x1b[31m%s\x1b[0m',`Exiting NASS connection with status ${rep.status} and message: ${rep.message}\n\x1b[90mAdditional data: ${JSON.stringify(rep.data)}`);
        return res.status(rep.status).json(rep.data);
    }
}