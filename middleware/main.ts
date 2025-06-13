import { db } from "..";
import { software } from "../software/dir";
import { ReplyType } from "../types/.types/reply.type";
import middleware from "./dir";


export async function NASS_Verification_Process(
    req, res, next 
) {
    console.log("NASS Verification Process started.");
    if (process.env.NASS_SCV_ENABLED !== "true") {
        console.log("NASS SCV is disabled, skipping verification process.");
        return next();
    } else {
        if (process.env.NASS_UCR_ENABLED === "true") {
            const isUCRCorrect : boolean = middleware.check.ucr(req.body);
            if (!isUCRCorrect) {
                console.log("Something is wrong with the UCR - exiting NASS Verification Process.")
                console.log("UCR is not valid, see the following: ", req.body)
                return res.status(400).send("Invalid request format.");
            }
        }
        
        if (process.env.NASS_BLACKLIST_ENABLED === "true") {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const isBlackListed : ReplyType = await middleware.check.blacklist(res, ip);
            if (!isBlackListed.success) {
                return software.methods.manageErrorCode(isBlackListed, res);
            } 
        }

        if (process.env.NASS_SERVICE_FILTER === "true") {
            const isRequestOriginValid : ReplyType = await middleware.check.origin(req.body);
            if (!isRequestOriginValid.success) {
                return software.methods.manageErrorCode(isRequestOriginValid, res);
            }
        }

        console.log("NASS Verification Process completed successfully.");
        return next();
    }

}