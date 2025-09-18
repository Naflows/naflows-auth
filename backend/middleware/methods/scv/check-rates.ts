import { v4 } from "uuid";
import { db } from "../../..";
import { ReplyType } from "../../../types/.types/reply.type";
import UCRType from "../../../types/.types/ucr.type";
import { software } from "../../../software/dir";
import secure from "../../../secure/global/dir";
import { services } from "../../../secure/services/dir";
import { Service, UserRequest } from "../../../types/.types/collections.type";

export async function checkRates(UCR: UCRType): Promise<ReplyType> {
  const ratesCollection = db.collection("requests");
  if (ratesCollection) {
    console.log(`Searching for service ${UCR.client.service}`)
    const service: Service = (await services.service.get(UCR.client.service) as ReplyType).data as Service;
    const reqRates = await ratesCollection.findOne({
      associated_service: UCR.client.service,
      associated_service_key: service.service_token,
    });


    if (!reqRates) {
      // If no rates found, create a new one

      await ratesCollection.insertOne({
        id: v4(),
        device_fingerprint: UCR.user.device_fingerprint,
        requests: [{ last_requests: [Date.now()], request_number: 1, ip: UCR.user.ip, userAgent: UCR.user.agent }],
        associated_service: UCR.client.service,
        associated_service_key: service.service_token
      });
    } else {
      const requestsArray: Array<UserRequest> = reqRates.requests;
      // Find user IP and Agent in requests array

      let userRequest: UserRequest = requestsArray.find((req: UserRequest) => {
        return req.ip === UCR.user.ip && req.userAgent === UCR.user.agent;
      });

      if (!userRequest) {
        console.log(`No user request found for IP: ${UCR.user.ip}, UserAgent: ${UCR.user.agent}`);
        const newRequest: UserRequest = {
          last_requests: [Date.now()],
          request_number: 1,
          ip: UCR.user.ip,
          userAgent: UCR.user.agent
        };
        requestsArray.push(newRequest);
        userRequest = newRequest;
      }

      const timeoutSeconds = process.env.BLACKLIST_RATES_TIMEOUT ? parseInt(process.env.BLACKLIST_RATES_TIMEOUT) : 60;
      const rateLimit = process.env.BLACKLIST_RATES ? parseInt(process.env.BLACKLIST_RATES) : 100;
      console.log(`User request found: ${JSON.stringify(userRequest)}`);

      if (
        // Calculate the amount of requests in the last BLACKLIST_RATES seconds
        (userRequest.last_requests.filter((r) => r > Date.now() - timeoutSeconds * 1000).length > rateLimit)
      ) {
        return software.methods.serverReply(429, "Rate limit exceeded. Too many requests.");
      } else {
        await ratesCollection.updateOne(
          { 
            associated_service: UCR.client.service
          },
          {
            $set: {
              lastRequest: Date.now(),
              requests: [
                ...requestsArray.filter((req: UserRequest) => req.ip !== UCR.user.ip || req.userAgent !== UCR.user.agent),
                {
                  last_requests: [...userRequest.last_requests, Date.now()],
                  request_number: userRequest.request_number + 1,
                  ip: UCR.user.ip,
                  userAgent: UCR.user.agent
                }
              ],
            },
          }
        );
      }
    }

    return software.methods.serverReply(200, "Rate limit not exceeded, request recorded.");

  } else {
    return software.methods.serverReply(500, "Internal server error. Rates collection not found.");
  }
}
