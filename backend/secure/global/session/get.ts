import { Session } from "inspector/promises";
import { db } from "../../..";
import { Collection } from "mongoose";
import secure from "../dir";
import { UserSession } from "../../../types/.types/collections.type";



export default async function getSession(sessionID: string, hash: boolean = false): Promise<UserSession | null> {
    const sessionsCollection = db.collection("sessions") as Collection<UserSession>;

    // If hash is TRUE, it means the session ID provided is already hashed, which means we can't directly query the session since their IDs are not hashed. 


    async function getSessionByHashedID(hashedSessionID: string): Promise<UserSession | null> {
        const allSessions = await sessionsCollection.find({}).toArray() as UserSession[];
        for (const session of allSessions) {
            if (secure.hash(session.id) === sessionID) {
                return session;
            }
        }
        return null;
    }


    const session = hash ? await getSessionByHashedID(sessionID) : await sessionsCollection.findOne({ id: sessionID }) as UserSession;
    return session;
}