import { db } from "../..";
import { Tokens, UserSession } from "../../types/.types/collections.type";
import { ReplyType } from "../../types/.types/reply.type";
import UCRType from "../../types/.types/ucr.type";


export async function stv(req: Request, res: Response): Promise<ReplyType> {
    const sessionsCollection = db.collection("sessions");
    const tokensCollection = db.collection("tokens");
    const ucr = req.body as unknown as UCRType;

    if (sessionsCollection && tokensCollection) {
        let sessionID = ucr.user.session_id;
        if ((req as any).ssvData) {
            sessionID = (req as any).ssvData.session.id;
        }
    } else {
        return {
            status: 500,
            success: false,
            message: "Internal server error: Sessions or Tokens collection not found.",
        };
    }


    return {
        status: 200,
        success: true,
        message: "STV process completed successfully.",
    }
}