import { Collection } from "mongoose";
import { db } from "../..";
import secure from "../../secure/dir";
import { Tokens, User, UserSession } from "../../types/.types/collections.type";
import { ReplyType } from "../../types/.types/reply.type";
import UCRType from "../../types/.types/ucr.type";
import middleware from "../dir";


export async function stv(req: Request, res: Response, ssv: ReplyType): Promise<ReplyType> {
    const sessionsCollection = db.collection("sessions") as Collection<UserSession>;
    const tokensCollection = db.collection("tokens") as Collection<Tokens>;
    const usersCollection = db.collection("users") as Collection<User>;
    const ucr = req.body as unknown as UCRType;


    console.log("\x1b[34m%s\x1b[0m", "------ STV Process started ------");
    console.log("\x1b[34m%s\x1b[0m", `SSV Data: ${JSON.stringify(ssv)}`);

    if (sessionsCollection && tokensCollection && usersCollection) {
        // This means a new session has been issued. So, a new token must be created.
        const tokenRenewal : ReplyType = await middleware.token.renewal(req,res,ssv, { sessions : sessionsCollection, tokens : tokensCollection, users : usersCollection });
        if (tokenRenewal.success) {
            console.log("\x1b[32m%s\x1b[0m", "New session token created successfully.");
        } else {
            console.error("\x1b[31m%s\x1b[0m", "Failed to create new session token:", tokenRenewal.message);
        }
        return tokenRenewal;
    } else {
        return {
            status: 500,
            success: false,
            message: "Internal server error: collections not found.",
        };
    }


    return {
        status: 200,
        success: true,
        message: "STV process completed successfully.",
    }
}