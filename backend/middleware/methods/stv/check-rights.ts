import { Collection } from "mongoose";
import { db } from "../../..";
import { software } from "../../../software/dir";
import { Tokens, User } from "../../../types/.types/collections.type";
import UCRType from "../../../types/.types/ucr.type";
import secure from "../../../secure/global/dir";
import { services } from "../../../secure/services/dir";
import nass from "../../../nass/dir";

// WARNING : THIS FUNCTION IS TO BE USED WITH A TOKEN AND NOT WITH USER CREDENTIALS.
// The token feature is made for users to access services without re-sending their credentials each time.
// Therefore, this function checks the rights associated with the token, not with the user directly. Also, the token is checked directly in the STV process before this function is called.


export async function checkTokenRights(ucr: UCRType) {
    try {

        const serviceId = ucr.client.service;
        const serviceRoute = ucr.request.url;

        const tunnel = await nass.tunnel.get(serviceId, serviceRoute);

        if (!tunnel) {
            return software.methods.serverReply(404, "No tunneling route found for this service and route.");
        }


        const user : User = await secure.user.get(ucr.user.user_id, false);

        if (!user) {
            return software.methods.serverReply(404, "User not found.");
        }

        

        const userRights = await services.service.user.getRights(user.id, serviceId, true,"TUNNELING_BY_INSTANCE");

        const rightOk = userRights.find((right) => {
            return tunnel.allowed_rights.includes(right.id);
        });


        if (!rightOk) {
            return software.methods.serverReply(403, "User does not have the required rights for this tunneling route.", {
                success: false,
            });
        }

        return software.methods.serverReply(200, "Token rights checked successfully.", {
            success: true,
        });
    } catch (error) {
        return software.methods.serverReply(
            500,
            "An error occurred while checking token rights: " + (error as Error).message,
            {
                success: false,
            }
        );
    }
}