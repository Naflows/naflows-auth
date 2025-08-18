import { db } from "../../..";
import { software } from "../../../software/dir";
import { Service, NassServiceToken } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import UCRType from "../../../types/.types/ucr.type";

export async function checkRequestOrigin(UCR: UCRType): Promise<ReplyType> {
  /*

        This function checks the origin of the request by validating the client origin in the UCR.
        It comes in two steps:
        - Check if the client origin is valid 
        - Check if the client origin is still active
        - Check the client token

    */

  const servicesCollection = db.collection("services");
  const servicesToken = db.collection("service_tokens");

  if (servicesCollection && servicesToken) {
    //console.log(`Searching for service in the database with:\nIP: ${UCR.client.ip}\nDNS: ${UCR.client.dns}\nService: ${UCR.client.service}`);
    // The easiest way to check if a service exists is first to check ip + dns + service.
    const queriedService = (await servicesCollection.findOne({
      ip_address: UCR.client.ip,
      dns: UCR.client.dns,
      id: UCR.client.service,
    })) as unknown as Service | null;
    if (queriedService && queriedService.status === "ACTIVE") {
      //console.log(`Service ${queriedService.name} is active, checking service token...`);
      //console.log(`Token parameters are:\nService ID: ${queriedService.id}\nToken: ${UCR.client.service_token}\nCreated at: ${UCR.client.service_token_birth}`);
      const serviceToken = (await servicesToken.findOne({
        service_id: queriedService.id,
        token: UCR.client.service_token,
        created_at: UCR.client.service_token_birth,
      })) as unknown as NassServiceToken | null;
      //console.log(`The following service token are related to ${queriedService.name}: `, serviceToken ? serviceToken.id : "No service token found");
      if (serviceToken) {
        const expiredToken = serviceToken.created_at + serviceToken.lifespan < Date.now() ||
          (process.env.SERVICE_TOKEN_MAXIMAL_RATES ?
          serviceToken.uses > parseInt(process.env.SERVICE_TOKEN_MAXIMAL_RATES) : true);
        // console.log(`Service token ${serviceToken.token} for service ${queriedService.name} is ${
        //   expiredToken ? "expired" : "valid"}.`);
        if (serviceToken && !expiredToken) {
          return software.methods.serverReply(200,"Service access granted.");
        } else if (expiredToken && serviceToken) {
          console.error(
            "\x1b[31m%s\x1b[0m",
            `Service token ${serviceToken.token} expired for service ${queriedService.name}. Forcing reload.`
          );
          return software.methods.serverReply(409,"Conflict between service's token and NASS. Forcing reload. This might take a few seconds.");
        }
      } else {
        return software.methods.serverReply(403,"Invalid service token.");
      }
    } else {
      return software.methods.serverReply(403,"Unauthorized service access.");
    }
  } else {
    return software.methods.serverReply(500,"Internal server error. Services collections not found.");
  }
}
