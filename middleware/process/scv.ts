import { software } from "../../software/dir";
import { ReplyType } from "../../types/.types/reply.type";
import middleware from "../dir";
import { Request, Response } from "express";

export async function scv(req: Request, res: Response): Promise<ReplyType> {
  if (process.env.NASS_UCR_ENABLED === "true") {
    const isUCRCorrect: boolean = middleware.check.ucr(req.body);
    if (!isUCRCorrect) {
      console.log("\x1b[31m%s\x1b[0m", "Invalid UCR.");
      return {
          status: 400,
          message: "Invalid request format.",
          success: false,
        };
    }
  }

  if (process.env.NASS_RATES_LIMIT_ENABLED === "true") {
    const ratesCheck : ReplyType = await middleware.check.rates(req.body);
    if (!ratesCheck.success) {
      console.log(
        "\x1b[31m%s\x1b[0m",
        "Rate limit exceeded, exiting NASS Verification Process."
      );
      return ratesCheck;
    }
  }

  if (process.env.NASS_BLACKLIST_ENABLED === "true") {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const isBlackListed: ReplyType = await middleware.check.blacklist(res, ip);
    if (!isBlackListed.success) {
      return isBlackListed;
    }
  }

  if (process.env.NASS_SERVICE_FILTER === "true") {
    const isRequestOriginValid: ReplyType = await middleware.check.origin(
      req.body
    );
    if (!isRequestOriginValid.success) {
      return isRequestOriginValid;
    }
  }

  return {
    status : 200,
    message: "Successful connection",
    success: true,
  }
}
