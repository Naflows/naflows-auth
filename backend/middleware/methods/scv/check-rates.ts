import { v4 } from "uuid";
import { db } from "../../..";
import { ReplyType } from "../../../types/.types/reply.type";
import UCRType from "../../../types/.types/ucr.type";
import { software } from "../../../software/dir";

export async function checkRates(UCR: UCRType): Promise<ReplyType> {
  const ratesCollection = db.collection("requests");
  if (ratesCollection) {
    const reqRates = await ratesCollection.findOne({
      ip: UCR.user.ip,
      userAgent: UCR.user.agent,
      device_fingerprint: UCR.user.device_fingerprint,
    });
    if (!reqRates) {
      // If no rates found, create a new one
      await ratesCollection.insertOne({
        id : v4(),
        ip: UCR.user.ip,
        userAgent: UCR.user.agent,
        device_fingerprint: UCR.user.device_fingerprint,
        requests: [{ date  : Date.now(), request: UCR }],
        lastRequest: Date.now(),
        firstRequest: Date.now(),
      });
      return software.methods.serverReply(200, "Rate limit not exceeded, request recorded.");
    } else {
      const requestsArray = Array.isArray(reqRates.requests) ? reqRates.requests : [];
      const timeoutSeconds = process.env.BLACKLIST_RATES_TIMEOUT ? parseInt(process.env.BLACKLIST_RATES_TIMEOUT) : 60;
      const timeoutMs = timeoutSeconds * 1000;
      const lastRequests = requestsArray.filter((req: { date: number; request: UCRType }) => {
        return (
          req.date >
          Date.now() - timeoutMs
        );
      });

      if (
        lastRequests.length >= (process.env.BLACKLIST_RATES ? parseInt(process.env.BLACKLIST_RATES): 100)
      ) {
        return software.methods.serverReply(429,"Rate limit exceeded. Too many requests.");
      } else {
        await ratesCollection.updateOne(
          { _id: reqRates._id },
          {
            $set: {
              lastRequest: Date.now(),
              requests: [
                ...reqRates.requests,
                { date: Date.now(), request: UCR },
              ],
            },
          }
        );
        return software.methods.serverReply(200, "Rate limit not exceeded, request recorded.");
      }
    }
  } else {
    return software.methods.serverReply(500, "Internal server error. Rates collection not found.");
  }
}
