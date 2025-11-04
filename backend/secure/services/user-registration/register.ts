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
import { SecurityCode, Service, Tokens, User, UserSession } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import UCRType from "../../../types/.types/ucr.type";
import secure from "../../global/dir";
import { services } from "../dir";
import notifications from "../../../software/notifications/dir";
import mailing from "../../../software/mailing/dir";


export default async function registerUserInAPI(user: User, apiID: string, codeNumber: string | null, force = false, rights: string[]): Promise<ReplyType> {
    // Implementation for registering the user in the API
    const registerUser = async () => {
        const usersCollection = db.collection('users');
        const servicesCollection = db.collection('services');
        const sessionsCollection = db.collection('user_sessions');

        // Update user by creating a new entry in the services OBJECT
        const service = await services.service.get(apiID);
        if (!service.success) {
            return software.methods.serverReply(404, "Service not found.");
        }
        console.log("Service data:", service.data);
        const serviceData = service.data.service as Service;

        const userDoc = await usersCollection.updateOne(
            { id: user.id },
            {
                $set: {
                    [`services.${apiID}`]: {
                        id: secure.hash(apiID), active: true, joined_at: new Date().getTime(), rights, data_preferences: {
                            usage_data: "FULL",
                            personal_data: serviceData.public_settings.required_data || [],
                        }
                    }
                }
            },
            { upsert: true }
        );

        const serviceActualize = await servicesCollection.updateOne(
            { id: apiID },
            {
                $inc: { "details.users": 1 }
            }
        );

        if (userDoc.modifiedCount === 0 && serviceActualize.modifiedCount === 0) {
            return software.methods.serverReply(404, "User not found.");
        }

        // Create a notification
        const notification = await notifications.create(
            user.id,
            "INFO",
            {
                title: "Welcome to " + serviceData.name + "!",
                message: `You have been successfully registered to the ${ serviceData.name } service. You can now access the service using your Naflows account.`,
                link: "https://nass.naflows.com/account/services/" + apiID,
                associated_service: apiID
            },
            true
        );

        // const emailSent = await mailing.send(
        //     serviceData.name + " Via Naflows",
        //     user.email,
        //     `Welcome to ${serviceData.name}!`,
        //     await mailing.patterns.welcomeToService("https://nass.naflows.com/account/services/" + apiID, user, serviceData)
        // );

        // if (!emailSent.success) {
        //     console.error("Failed to send welcome email:", emailSent.message);
        // }

        if (!notification.success) {
            console.error("Failed to create notification:", notification.message);
        }

        await services.service.logs.create(apiID, `User registered to the service.`, "USER", "INFO", { user: user.id });

        return software.methods.serverReply(200, "User credentials are valid for API registration.");
    }

    if (force) {
        const registration = await registerUser();
        return registration;
    } else if (!force && codeNumber === null) {
        return software.methods.serverReply(400, "Bad Request: Security code must be provided when force is true.");
    }



    if (codeNumber) {
        console.log("Code provided, verifying...");
        const code: SecurityCode = await secure.code.get(null, codeNumber);
        if (!code) {
            return software.methods.serverReply(404, "Security code not found.");
        }

        const isCodeValid = await secure.code.check(code, user, apiID, "SELF_SERVICE_MANAGEMENT");
        if (!isCodeValid) {
            return software.methods.serverReply(400, "Bad Request: Invalid or expired security code.");
        }

        const updatedCode = await secure.code.invalidate(code.id);
        if (!updatedCode.success) {
            return software.methods.serverReply(500, "Failed to invalidate security code.");
        }

        const registration = await registerUser();

        return registration;
    }





    return software.methods.serverReply(200, "User registered successfully.");
}