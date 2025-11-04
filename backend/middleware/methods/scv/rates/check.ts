import { v4 } from "uuid";
import { db } from "../../../..";
import { ReplyType } from "../../../../types/.types/reply.type";
import UCRType from "../../../../types/.types/ucr.type";
import { software } from "../../../../software/dir";
import secure from "../../../../secure/global/dir";
import { services } from "../../../../secure/services/dir";
import { Requests, Service, UserRequest } from "../../../../types/.types/collections.type";
import { Collection } from "mongoose";
import middleware from "../../../dir";

export async function checkRates(UCR: UCRType): Promise<ReplyType> {
  const ratesCollection = db.collection("requests") as Collection<Requests>;
  if (ratesCollection) {
    console.log(`Searching for service ${UCR.client.service}`)

    const serviceId = UCR.client.service;

    const service: Service = (await services.service.get(serviceId)).data.service;

    if (!service) {
      return software.methods.serverReply(404, "Service not found for rate checking.");
    }

    const reqRates = await ratesCollection.findOne({
      associated_service: service.id
    }) as Requests;


    if (!reqRates) {
      // If no rates found, create a new one
      const userRequest : UserRequest = {
        last_requests: [Date.now()],
        request_number: 1,
        ip: UCR.user.ip,
        userAgent: UCR.user.agent,
        device_fingerprint: UCR.user.device_fingerprint
      }
      
      const record = await middleware.rates.create(service, userRequest);
      if (!record.success) {
        return software.methods.serverReply(500, "Failed to create rate record for service.");
      }
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
          userAgent: UCR.user.agent,
          device_fingerprint: UCR.user.device_fingerprint
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
                  userAgent: UCR.user.agent,
                  device_fingerprint: UCR.user.device_fingerprint
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