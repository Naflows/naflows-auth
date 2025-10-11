import { db } from "../../../..";
import { software } from "../../../../software/dir";
import { ReplyType } from "../../../../types/.types/reply.type";
import { ServiceRights } from "../../../../types/.types/tunneling.type";

export async function createServiceRights(service_id: string, name: string, rights: ServiceRights["rights"], deletable : boolean = false, type : ServiceRights["type"] = "SERVICE_BY_NASS") : Promise<ReplyType> {
    const serviceRightsDB = db.collection('service_rights');

    const createNotExistingHue = async () : Promise<number> => {
        const existingHues = (await serviceRightsDB.find({ service_id: service_id }).toArray()).map(r => parseInt(r.hue));
        let hue = Math.floor(Math.random() * 360);
        while (existingHues.includes(hue)) {
            hue = Math.floor(Math.random() * 360);
        }
        return hue;
    }


    // Check if a right with the same name already exists in this service
    const existingRight = await serviceRightsDB.findOne({ service_id: service_id, name: name });

    if (existingRight) {
        return software.methods.serverReply(409, "A rights set with this name already exists in the service.");
    }

    const right : ServiceRights = {
        id: `rights-${service_id}-${Date.now()}`,
        service_id: service_id,
        name: name,
        rights: rights,
        created_at: Date.now(),
        updated_at: Date.now(),
        deletable: deletable,
        hue: (await createNotExistingHue()).toString(),
        type : type
    }

    const u = await serviceRightsDB.insertOne(right);
    if (u.acknowledged) {
        return software.methods.serverReply(201, "Service rights created successfully.", { right: right });
    } else {
        return software.methods.serverReply(500, "Failed to create service rights.");
    }
}