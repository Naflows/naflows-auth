import { db } from "..";
import { software } from "../software/dir";
import { ReplyType } from "../types/reply.type";
import middleware from "./dir";


export async function NASS_Verification_Process(
    req, res, next 
) {
    // Middleware to log requests
    console.log(`${req.method} request for '${req.url}'`);
    // Log all req informations 
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);

    /*

        * Must externalize this middleware
        * First UCR
        * Then blacklist
        * Then requests rates
        * Then service/client
        * Then user
        * Then token
        * Then ok

    */

    if (process.env.NASS_SCV_ENABLED !== "true") {
        return next();
    } else {
        if (middleware.check.isUCR(req.body) == false && process.env.NASS_UCR_ENABLED === "true") {
            return res.status(400).send("Invalid request format.");
        } else {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            /*
                Collections must be loaded for the middleware. 
                Unauthorized access must be filtered or request is canceled.
            */

            const isBlackListed : ReplyType = await middleware.check.blacklist(res, ip);
            if (!isBlackListed.success) {
                software.methods.manageErrorCode(isBlackListed, res);
            } else {
                next();
            }




        }
    }

}