import { db } from "../..";
import { ReplyType } from "../../types/.types/reply.type";
import { software } from "../dir";
import * as crypto from "crypto";

export async function uploadPicture(id: string, picture: string, type: "service" | "user" | "banner"): Promise<string> {
    const imagesCollection = db.collection("pictures");
    const newId = crypto.randomUUID() + "-" + Date.now();


    const filter = { id: id, type: type };
    const update = { $set: { data: picture, updatedAt: new Date(), id: newId } };
    const options = { upsert: true };


    try {
        await imagesCollection.updateOne(filter, update, options);
        return newId;
    } catch (error) {
        return null;
    }
}