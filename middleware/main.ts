import { db } from "..";
import { software } from "../software/dir";
import { ReplyType } from "../types/.types/reply.type";
import middleware from "./dir";

export async function NASS_Verification_Process(req, res, next) {
    console.log('\x1b[34m%s\x1b[0m',`------ INCOMING REQUEST at ${req.body.request.url}  ------`);
  try {
    console.log("NASS Verification Process started.");
    if (process.env.NASS_SCV_ENABLED !== "true") {
      console.log("NASS SCV is disabled, skipping verification process.");
      return next();
    } else {
      if (process.env.NASS_UCR_ENABLED === "true") {
        const isUCRCorrect: boolean = middleware.check.ucr(req.body);
        if (!isUCRCorrect) {
          console.log('\x1b[31m%s\x1b[0m', "Invalid UCR.");
          return software.methods.manageErrorCode({
            status: 400,
            message: "Invalid request format.",
            success: false,
          }, res);
        }
      }

    if (process.env.NASS_RATES_LIMIT_ENABLED === "true") {
      const ratesCheck = await middleware.check.rates(req.body);
      if (!ratesCheck.success) {
        console.log('\x1b[31m%s\x1b[0m',"Rate limit exceeded, exiting NASS Verification Process.");
        return software.methods.manageErrorCode(ratesCheck, res);
      }
    }

      if (process.env.NASS_BLACKLIST_ENABLED === "true") {
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const isBlackListed: ReplyType = await middleware.check.blacklist(
          res,
          ip
        );
        if (!isBlackListed.success) {
          return software.methods.manageErrorCode(isBlackListed, res);
        }
      }

      if (process.env.NASS_SERVICE_FILTER === "true") {
        const isRequestOriginValid: ReplyType = await middleware.check.origin(
          req.body
        );
        if (!isRequestOriginValid.success) {
          return software.methods.manageErrorCode(isRequestOriginValid, res);
        }
      }

      console.log('\x1b[32m%s\x1b[0m',"NASS Verification Process completed successfully.");
      return next();
    }
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m',"Unexpected error during NASS Verification Process:", error);
    return software.methods.manageErrorCode(
      {
        status: 500,
        message: "Internal server error during NASS Verification Process.",
        success: false,
      },
      res
    );
  }
}
