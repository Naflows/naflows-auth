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

    const allSessionsByIpAndAgent = await sessionsCollection.find({
        ip : ipAddress,
        agent : userAgent
    }).toArray();

    console.log(`All sessions matching IP ${ipAddress} and Agent ${userAgent}: ${JSON.stringify(allSessionsByIpAndAgent)}`);

    const session = allSessionsByIpAndAgent.find(s => secure.verify(userID, s.user_id));

    if (session) {
        console.log(`Found session by connection: ${JSON.stringify(session)}`);
        return session;
    } else {
        console.log("No session found by connection.");
        return null;
    }
}
