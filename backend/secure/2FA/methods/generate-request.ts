import { software } from "../../../software/dir";
import { User, UserSession } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import secure from "../../global/dir";
import { analyze2FAContext } from "./analyze-context";
import { twoFA } from "../dir";
import TwoFALog from "../../../types/.types/twoFA.type";



export async function generate2FARequest(user: User, cryptographic_token:string, context: {
    action: TwoFALog["action"];
    data: {
        serviceID: string;
    }
}): Promise<ReplyType> {
    // Reminder : sessionID holds serviceID in this context

    console.log("Generating 2FA request for user:", user.id, "with context:", context);

    // This function ONLY generates a 2FA request token and stores it in the database. The actual sending of the 2FA code (via email, SMS, etc.) is handled elsewhere, and triggered ONLY by the user AFTER the request is generated.

    const contextAnalysis = await twoFA.analysis.context(user, context, cryptographic_token);
    if (!contextAnalysis.valid) {
        return software.methods.serverReply(400, "Invalid 2FA context: " + contextAnalysis.reason);
    } else if (contextAnalysis.existing) {
        console.log("Existing 2FA request found:", contextAnalysis.existing.id, "state:", contextAnalysis.existing.state);
        return software.methods.serverReply(200, "Existing 2FA request found.", {
            codeSent : contextAnalysis.existing.state === "REQUEST_SENT"
        });
    } else {
        
        const twoFALog = await twoFA.logs.create(user, context.action, context.data);
        if (!twoFALog.success) {
            return software.methods.serverReply(500, "Failed to create 2FA log.");
        }


        

        return software.methods.serverReply(201, "2FA request generated successfully.", {
            middleware: { // Send back the cryptographic token to the client via middleware for further use
                "2fa_cryptographic_token": twoFALog.data.userData.log.cryptographic_token
            },
            "codeSent": false
        });
    }

}