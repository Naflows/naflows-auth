import { db } from "../../..";
import { software } from "../../../software/dir";
import { ReplyType } from "../../../types/.types/reply.type";
import { services } from "../dir";


export async function getService(api_id: string): Promise<ReplyType> {
  const serviceCollection = db.collection("services");
  if (serviceCollection) {
    const service = await serviceCollection.findOne({ id: api_id });
    if (service) {
      return software.methods.serverReply(200, "Service found.", {
        service: service
      });
    } else {
       console.log(`All services: ${JSON.stringify(await serviceCollection.find().toArray())}`);
      return software.methods.serverReply(404, "Service not found.");
    }
  } else {
    return software.methods.serverReply(500, "Internal server error. Services collection not found.");
  }
}