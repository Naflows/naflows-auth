import { ReplyType } from "../../types/.types/reply.type";
import { Response } from "express";


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
    if (!rep.success) {
        console.log(`Exiting NASS connection with status ${rep.status} and message: ${rep.message}`);
        return res.status(rep.status).send(rep.message);
    }
}