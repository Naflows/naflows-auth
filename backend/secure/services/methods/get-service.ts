import { db } from "../../..";
import getPicture from "../../../software/data-management/get-picture";
import { software } from "../../../software/dir";
import { ReplyType } from "../../../types/.types/reply.type";
import { services } from "../dir";


export async function getService(api_id: string, getFullPicture: boolean = true): Promise<ReplyType> {
  const serviceCollection = db.collection("services");
  if (serviceCollection) {
    const service = await serviceCollection.findOne({ id: api_id });
    if (service) {
      return software.methods.serverReply(200, "Service found.", {
        service: {
          ...service,
          picture:  getFullPicture ? await getPicture(service.picture ?? "", "service") : service.picture,
          banner: getFullPicture ? await getPicture(service.banner ?? "", "banner") : service.banner,
        }
      });
    } else {
       console.log(`All services: ${JSON.stringify(await serviceCollection.find().toArray())}`);
      return software.methods.serverReply(404, "Service not found.");
    }
  } else {
    return software.methods.serverReply(500, "Internal server error. Services collection not found.");
  }
}