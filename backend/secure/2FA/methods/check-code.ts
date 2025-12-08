import { software } from "../../../software/dir";
import { User } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import TwoFALog from "../../../types/.types/twoFA.type";
import secure from "../../global/dir";
import { twoFA } from "../dir";


export async function check2FACode(user: User, cryptographic_token: string, context: {
    action: TwoFALog["action"];
    data: {
        serviceID: string;
    }
}, code: string): Promise<ReplyType> {
    const twoFa = await twoFA.analysis.context(
        user,
        context,
        cryptographic_token
    );

    if (!twoFa.valid) {
        return software.methods.serverReply(404, twoFa.reason || "No matching 2FA request found.");
    }

    const twoFALog = twoFa.existing!;

    if (secure.verify(code, twoFALog.code)) {
        const u = await twoFA.logs.update(twoFALog.id, "REQUEST_COMPLETED", {
            used : {
                validated_at : Date.now(),
                is_used : false
            }
        });
        if (!u.success) {
            return software.methods.serverReply(500, "Failed to update 2FA log.");
        }

        return software.methods.serverReply(200, "2FA code validated successfully.");
    } else {
        const u = await twoFA.logs.update(twoFALog.id, twoFALog.attempts + 1 >= 3 ? "REQUEST_FAILED" : twoFALog.state, {
            attempts: twoFALog.attempts + 1
        });
        if (!u.success) {
            return software.methods.serverReply(500, "Failed to update 2FA log.");
        }

        return software.methods.serverReply(400, "Invalid 2FA code.");
    }
}