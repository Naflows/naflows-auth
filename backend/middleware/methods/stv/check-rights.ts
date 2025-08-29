import { Collection } from "mongoose";
import { db } from "../../..";
import { software } from "../../../software/dir";
import { Tokens, User } from "../../../types/.types/collections.type";
import UCRType from "../../../types/.types/ucr.type";
import secure from "../../../secure/global/dir";



export async function checkTokenRights(token: Tokens, ucr: UCRType) {
    try {

        const routes = await software.methods.getRoutesRights();
        const requestRoute = ucr.request.url;

        if (!routes || typeof routes !== 'object' || Object.keys(routes).length === 0) {
            return software.methods.serverReply(500, "Failed to fetch routes rights.");
        }

        console.log(`Checking rights for route: ${requestRoute}`);
        if (!routes[requestRoute]) {
            return software.methods.serverReply(404, "Route not found.");
        }

        if (!routes[requestRoute].open) {
            const usersCollection = db.collection("users") as Collection<User>;
            const user = await usersCollection.findOne({ id: secure.hash(ucr.user.user_id) }) as unknown as User;
            if (!user) {
                return software.methods.serverReply(404, "User not found.");
            }

            const areRightsValid = routes[requestRoute].rights.every(right =>
                token.rights.includes(right)
            );


            const areUserRightsValid = routes[requestRoute].levels.some(level =>
                user.services[ucr.client.service].rights.includes(level)
            );

            if (!areUserRightsValid || !areRightsValid) {
                return software.methods.serverReply(
                    403,
                    "Insufficient rights to access this route.",
                );
            }
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