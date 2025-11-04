import { db } from "../../..";
import nass from "../../../nass/dir";
import secure from "../../../secure/global/dir";
import { services } from "../../../secure/services/dir";
import { software } from "../../../software/dir";
import { Service, NassServiceToken, ServiceToken } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import UCRType from "../../../types/.types/ucr.type";


async function executeBuild(serviceToken: NassServiceToken | null, queriedService: Service, success: boolean = false): Promise<ReplyType> {

  if (success) {
    return software.methods.serverReply(200, "Service access granted.", {
      serviceToken: {
        id: serviceToken ? serviceToken.id : "official_service_token",
        service_id: queriedService.id,
        token: "official_service_token",
      }
    });
  }

  console.error(
    "\x1b[31m%s\x1b[0m",
    `Service token ${serviceToken ? serviceToken.token : "unknown"} expired for service ${queriedService.name}. Forcing reload.`
  );

  // Remove all tokens related to this service
  const servicesToken = db.collection("service_tokens");
  await servicesToken.deleteMany({
    service_id: queriedService.id
  });

  const tokenRT: ReplyType = await services.token.new(queriedService.id, null, "AUTO");
  if (!tokenRT.success) {
    return software.methods.serverReply(tokenRT.status, tokenRT.message);
  }
  const token = tokenRT.data?.serviceToken as ServiceToken;

  await services.service.logs.create(queriedService.id, `Service token expired and was renewed.`, "SYSTEM", "INFO", { message: "NASS generated a new production token because the old one expired." });

  return software.methods.serverReply(409, "Conflict between service's token and NASS. Forcing reload. This might take a few seconds.", {
    serviceToken: token
  });

}

async function isOfficialService(service: Service): Promise<boolean> {
  return service.id === "naflows_backend" && service.details && service.details.official === true && service.status === "ACTIVE" && service.dns === "nass.naflows.com";
}

export async function checkRequestOrigin(client: {
  ip: string;
  dns: string;
  service: string;
  service_token: string;
  service_token_birth: number;
}, naflowsFrontendOnly: boolean = false): Promise<ReplyType> {
  const servicesCollection = db.collection("services");
  const servicesToken = db.collection("service_tokens");

  if (servicesCollection && servicesToken) {
    // The easiest way to check if a service exists is first to check ip + dns + service.
    // Apparently, client.ip returns something like ::ffff:IP_ADDRESS, so we need to take that into account.
    const serviceData = await services.service.get(client.service) as ReplyType;

    if (!serviceData.success) {
      return software.methods.serverReply(403, "Service not found.");
    }

    const queriedService = serviceData.data.service as Service;
    const isOriginValid = queriedService && (queriedService.ip_address.includes(client.ip.replace("::ffff:", "")));

    if (isOriginValid && queriedService.status === "ACTIVE") {
      if (naflowsFrontendOnly && queriedService.details && queriedService.details.official !== true) {
        console.log("\x1b[31m%s\x1b[0m", `Service ${queriedService.name} is not marked as official, rejecting request from Naflows frontend.`);
        return software.methods.serverReply(403, "This service is not authorized to access this endpoint.");
      }
      const serviceToken = (await servicesToken.findOne({
        service_id: queriedService.id
      })) as unknown as NassServiceToken | null;
      //console.log(`The following service token are related to ${queriedService.name}: `, serviceToken ? serviceToken.id : "No service token found");

      // Mostly used to generated official service tokens for Naflows services like NASS itself
      if (await isOfficialService(queriedService)) {
        return (await executeBuild(null, queriedService, true));
      }


      if (serviceToken) {

        console.log(`
        | Label       | Token INFO                 | Request INFO
        |-------------|----------------------------|-------------------------------
        | Service ID  | ${serviceToken.service_id} | ${client.service}
        | Uses        | ${serviceToken.uses}       |
        | Created at  | ${serviceToken.created_at} ${typeof serviceToken.created_at} | ${client.service_token_birth} ${typeof client.service_token_birth}
        | Lifespan    | ${serviceToken.lifespan}   | ${Date.now()}
        
        | Label       | Value
        | Same Token  | ${secure.verify(client.service_token, serviceToken.token)}
        | Same Birth  | ${serviceToken.created_at === client.service_token_birth}
        `)

        const isValid = secure.verify(client.service_token, serviceToken.token) && serviceToken.created_at === client.service_token_birth;

        if (isValid) {
          console.log(`Service token valid for service ${queriedService.name}. Checking expiration...`);
        } else {
          console.log("\x1b[31m%s\x1b[0m", `Service token invalid for service ${queriedService.name}.`);
          return software.methods.serverReply(403, "Invalid service token.");
        }

        const expiredToken = serviceToken.created_at + serviceToken.lifespan < Date.now() ||
          (process.env.SERVICE_TOKEN_MAXIMAL_RATES ?
            serviceToken.uses > parseInt(process.env.SERVICE_TOKEN_MAXIMAL_RATES) : true);



        if (!serviceToken && (!queriedService.details.official)) {
          return software.methods.serverReply(403, "Service token not found.");
        }

        console.log(`Token expiration check: created at ${serviceToken.created_at} + lifespan ${serviceToken.lifespan} < now ${Date.now()} = ${serviceToken.created_at + serviceToken.lifespan < Date.now()}`);

        if (!expiredToken) {
          serviceToken.uses++;
          await servicesToken.updateOne({ id: serviceToken.id }, { $set: { uses: serviceToken.uses } });


          return software.methods.serverReply(200, "Service access granted.");
        } else if (expiredToken && serviceToken) {
          return await executeBuild(serviceToken, queriedService);
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
