import { Collection } from "mongoose";
import { db } from "../../..";
import { UserSession } from "../../../types/.types/collections.type";
import secure from "../dir";


export default async function findSessionByConnection(
    userID : string,
    ipAddress : string,
    userAgent : string
 ) : Promise<UserSession | null> {
    const sessionsCollection = db.collection("sessions") as Collection<UserSession>;

    return sessionsCollection.findOne({
        user_id : secure.hash(userID),
        ip : ipAddress,
        agent : userAgent
    });
}