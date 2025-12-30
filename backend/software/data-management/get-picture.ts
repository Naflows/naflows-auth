import { db } from "../..";


export default async function getPicture(id: string, type: "service" | "user" | "banner"): Promise<string | null> {
    const picturesCollection = db.collection("pictures");

    const pictureDoc = await picturesCollection.findOne({ id: id, type: type });


    if (pictureDoc && pictureDoc.data) {
        console.log(`Picture found for id: ${id}, type: ${type}: ${pictureDoc.data.substring(0, 10)}...`);
        return pictureDoc.data;
    } else {
        return null;
    }
}   