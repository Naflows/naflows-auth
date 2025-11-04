import { software } from "../../software/dir";
import { ReplyType } from "../../types/.types/reply.type";
import middleware from "../dir";
import { Request, Response } from "express";

export async function scv(req: Request, res: Response, naflowsFrontendOnly : boolean = false): Promise<ReplyType> {
  if (process.env.NASS_UCR_ENABLED === "true") {
    if (!middleware.check.ucr(req.body)) {
      return software.methods.serverReply(400, `Request format is invalid.`);
    }
  }

  if (process.env.NASS_RATES_LIMIT_ENABLED === "true") {
    const ratesCheck : ReplyType = await middleware.check.rates(req.body);
    if (!(ratesCheck).success) {
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
      req.body.client,
      naflowsFrontendOnly
    );
    console.log("Request origin check result:", isRequestOriginValid);
    if (!isRequestOriginValid.success) {
      return isRequestOriginValid;
    }
  }

  return software.methods.serverReply(
    200,
    "SCV Process completed successfully.",
  );
}
