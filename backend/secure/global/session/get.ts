import { Session } from "inspector/promises";
import { db } from "../../..";
import { Collection } from "mongoose";
import secure from "../dir";
import { UserSession } from "../../../types/.types/collections.type";



export default async function getSession(sessionID : string) : Promise<UserSession | null> {
    const sessionsCollection = db.collection("sessions") as Collection<UserSession>;
    const session = await sessionsCollection.findOne({ id: (sessionID) }) as UserSession;
    return session;
}