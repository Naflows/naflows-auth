import { Collection } from "mongoose";
import { db } from "../../../..";
import { software } from "../../../../software/dir";
import { UserRights } from "../../../../types/.types/tunneling.type";
import secure from "../../../global/dir";
import { services } from "../../dir";


export async function assignServiceRights(rightID : string, userID : string, serviceID : string) {
    const right = await services.service.rights.get(rightID, serviceID);
    if (!right) {
        return software.methods.serverReply(404, "Service right not found.");
    }

    const userRightsDB = db.collection('user_rights')  as Collection<UserRights>;

    const existing = await userRightsDB.find({}).toArray() as UserRights[];
    const userRight = existing.find((u : UserRights) =>secure.verify(userID, u.user_id) && u.service_id === serviceID);

    if (userRight) {
        if (userRight.rights.includes(rightID)) {
            return software.methods.serverReply(200, "User already has the specified rights.");
        } else {
            userRight.rights.push(rightID);
            userRight.updated_at = Date.now();
            const u = await userRightsDB.updateOne({id: userRight.id}, {$set: userRight});
        }
    }

    const newUserRight : UserRights = {
        id: `rights-${secure.hash(userID)}-${serviceID}-${Date.now()}`,
        user_id: secure.hash(userID),
        service_id: serviceID,
        rights : [rightID],
        created_at: Date.now(),
        updated_at: Date.now()
    }

    const u = await userRightsDB.insertOne(newUserRight);

    if (!u) {
        return software.methods.serverReply(500, "Failed to assign service right.");
    }

    return software.methods.serverReply(200, "Service right assigned successfully.");
}