import { db } from "../../..";
import { services } from "../../../secure/services/dir";
import { software } from "../../../software/dir";
import { Service, NassServiceToken } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import UCRType from "../../../types/.types/ucr.type";

export async function checkRequestOrigin(client: {
  ip: string;
  dns: string;
  service: string;
  service_token: string;
  service_token_birth: number;
}, naflowsFrontendOnly: boolean = false): Promise<ReplyType> {
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
    // Apparently, client.ip returns something like ::ffff:IP_ADDRESS, so we need to take that into account.
    const serviceData = await services.service.get(client.service) as ReplyType;

    if (!serviceData.success) {
      return software.methods.serverReply(403, "Service not found.");
    }

    const queriedService = serviceData.data as Service;

    console.log(`Queried services for id ${client.service}: `, queriedService ? queriedService.name : "No services found");
    console.log(`Client IP for request origin check: ${client.ip}`);
    console.log(`Available IPs : `, queriedService ? [queriedService.ip_address] : "No services found");
    const isOriginValid = queriedService &&
      (queriedService.ip_address.includes(client.ip.replace("::ffff:", "")));

    if (isOriginValid && queriedService.status === "ACTIVE") {
      //console.log(`Service ${queriedService.name} is active, checking service token...`);
      //console.log(`Token parameters are:\nService ID: ${queriedService.id}\nToken: ${UCR.client.service_token}\nCreated at: ${UCR.client.service_token_birth}`);

      if (naflowsFrontendOnly && queriedService.details && queriedService.details.official !== true) {
        console.log("\x1b[31m%s\x1b[0m", `Service ${queriedService.name} is not marked as official, rejecting request from Naflows frontend.`);
        return software.methods.serverReply(403, "This service is not authorized to access this endpoint.");
      }

      const serviceToken = (await servicesToken.findOne({
        service_id: queriedService.id,
        token: client.service_token,
        created_at: client.service_token_birth,
      })) as unknown as NassServiceToken | null;
      //console.log(`The following service token are related to ${queriedService.name}: `, serviceToken ? serviceToken.id : "No service token found");
      if (serviceToken) {
        const expiredToken = serviceToken.created_at + serviceToken.lifespan < Date.now() ||
          (process.env.SERVICE_TOKEN_MAXIMAL_RATES ?
            serviceToken.uses > parseInt(process.env.SERVICE_TOKEN_MAXIMAL_RATES) : true);
        // console.log(`Service token ${serviceToken.token} for service ${queriedService.name} is ${
        //   expiredToken ? "expired" : "valid"}.`);
        if (serviceToken && !expiredToken) {
          serviceToken.uses++;
          await servicesToken.updateOne({ id: serviceToken.id }, { $set: { uses: serviceToken.uses } });
          return software.methods.serverReply(200, "Service access granted.");
        } else if (expiredToken && serviceToken) {
          console.error(
            "\x1b[31m%s\x1b[0m",
            `Service token ${serviceToken.token} expired for service ${queriedService.name}. Forcing reload.`
          );
          return software.methods.serverReply(409, "Conflict between service's token and NASS. Forcing reload. This might take a few seconds.");
        }
      } else {
        return software.methods.serverReply(403, "Invalid service token.");
      }
    } else {
      return software.methods.serverReply(403, "Unauthorized service access.");
    }
  } else {
    return software.methods.serverReply(500, "Internal server error. Services collections not found.");
  }
}
