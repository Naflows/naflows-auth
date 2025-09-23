/*

    This function is built to allow users to register easily inside any API related to the NASS.

    This function happens in one to three steps: 
        1. Checks if the user is registered or not 
        2. If not, send a request to the user to ensure they allow the NASS to register them automatically.
        3. Once a request is sent with the token, the API will handle the registration process.

*/

import { Session } from "inspector/promises";
import { db } from "../../..";
import { software } from "../../../software/dir";
import { Tokens, User, UserSession } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import UCRType from "../../../types/.types/ucr.type";
import secure from "../../global/dir";
import { services } from "../dir";


export default async function registerUserInAPI(user: User, apiID: string, session_id: string, ucr : UCRType | null, force = false, rights: string[]): Promise<ReplyType> {
    // Implementation for registering the user in the API

    const session: UserSession = await secure.session.get(session_id);

    if (!session) {
        return software.methods.serverReply(401, "Unauthorized: Session not found.");
    }

    const registerUser = async () => {
        const usersCollection = db.collection('users');

        // Update user by creating a new entry in the services OBJECT

        const userDoc = await usersCollection.updateOne(
            { id: user.id },
            { $set: { [`services.${apiID}`]: { id: secure.hash(apiID), active: true, joined_at: new Date().getTime(), rights } } },
            { upsert: true }
        );

        if (userDoc.modifiedCount === 0) {
            return software.methods.serverReply(404, "User not found.");
        }

        return software.methods.serverReply(200, "User credentials are valid for API registration.");
    }

    if (force) {
        const registration = await registerUser();
        return registration;
    } else if (force && ucr === null) {
        return software.methods.serverReply(400, "Bad Request: UCR data must be provided when force is true.");
    }



    if (ucr.data && ucr.data.tokens && ucr.data.tokens.serviceRegistration) {
        if (ucr.user.password && ucr.user.identifier && (await secure.user.credentials(user.id, ucr.user.identifier, ucr.user.password))) {
            // User is registered and credentials are valid
            const isTokenValid = services.userRegistration.isTokenValid(ucr.data.tokens.serviceRegistration);

            if (!isTokenValid) {
                return software.methods.serverReply(403, "Invalid service registration token.");
            }

            const registration = await registerUser();
            return registration;
        } else {
            return software.methods.serverReply(403, "Invalid user credentials for API registration.");
        }
    }

    if (!Array.from(Object.keys(user.services)).includes(apiID) || !user.services[apiID].active) {
        // This means the user is not registered to the api 
        const token: ReplyType = await secure.token.create(user, session, ["API_REGISTRATION"], false, 1, {
            apiIDForRegistration: apiID,
        });
        if (token.success) {
            return software.methods.serverReply(200, "Token for API registration successfully created.", token.data);
        } else {
            return software.methods.serverReply(token.status, token.message, token.data);
        }
    }





    return software.methods.serverReply(200, "User registered successfully.");
}