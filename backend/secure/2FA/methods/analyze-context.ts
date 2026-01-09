import { Collection } from "mongoose";
import { db } from "../../..";
import { Service, Tokens, User, UserSession } from "../../../types/.types/collections.type";
import secure from "../../global/dir";
import { services } from "../../services/dir";
import TwoFALog from "../../../types/.types/twoFA.type";
import { twoFA } from "../dir";



export async function analyze2FAContext(user: User, context: {
    action: TwoFALog["action"];
    data: {
        serviceID: string;
    }
}, cryptographic_token: string, checkSocket: boolean = false): Promise<{
    valid: boolean;
    reason?: string;
    existing?: TwoFALog,
    checkSocket?: boolean
}> {

    // Is there already a token associated with this session for 2FA actions?
    if (cryptographic_token) {
        const existing2FA = await twoFA.logs.get(
            user.id,
            context.action,
            cryptographic_token,
            context.data
        )

        if (existing2FA.length === 0) {
            return { valid: false, reason: "Invalid or expired cryptographic token for 2FA context analysis." };
        }

        if (existing2FA.length > 0) {
            const log = existing2FA[0];
            if (log.state === "REQUEST_GENERATED" || log.state === "REQUEST_SENT" || log.state === "REQUEST_COMPLETED") {
                if (log.used.is_used) {
                    return { valid: false, reason: "A 2FA request has already been used for this action." };
                }


                if (log.created_at + (5 * 60 * 1000) < Date.now()) { // 5 minutes expiry
                    return { valid: false, reason: "This 2FA request has expired." };
                }

                if ((log.state === "REQUEST_GENERATED" || log.state === "REQUEST_SENT") && checkSocket) {
                    return { valid: false, reason: "The 2FA request has not been completed yet." };
                }

                return { valid: true, existing: log };
            } else if (log.attempts >= 3 || log.state === "REQUEST_FAILED") {
                return { valid: false, reason: "Maximum number of attempts reached for this 2FA request." };
            } else {
                return { valid: false, reason: "A 2FA request has already been completed for this action." };
            }
        }
    }


    let service : Service;
    if (context.data.serviceID) {
        const serviceResult = await services.service.get(context.data.serviceID);
        if (!serviceResult.success) {
            return { valid: false, reason: "Service not found." };
        }
        service = serviceResult.data.service;
    }


    switch (context.action) {
        case "TRANSFER_OWNERSHIP":
            if (service.created_by !== user.id) {
                return { valid: false, reason: "User is not the owner of the service." };
            }
            return { valid: true };
        
        case "DELETE_SERVICE":
            if (service.created_by !== user.id) {
                return { valid: false, reason: "User is not the owner of the service." };
            }
            return { valid: true };
        // For now, default to false
        case "JOIN_SERVICE":
            // Additional checks can be added here, e.g., is the user already a member of the service?
            const isMember = await services.service.user.isIn(context.data.serviceID, user.id);
            // TODO: check if the user has been invited to the service if it's private
            if (isMember) {
                return { valid: false, reason: "User is already a member of the service." };
            }
            return { valid: true };
        default:
            return { valid: false, reason: "Invalid action for 2FA context analysis." };
    }
}