import { software } from "../../../software/dir";
import mailing from "../../../software/mailing/dir";
import { User } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import TwoFALog from "../../../types/.types/twoFA.type";
import { twoFA } from "../dir";


export async function generate2FACode(user: User, cryptographic_token: string, context: {
    action: TwoFALog["action"];
    data: {
        serviceID: string;
    }
}): Promise<ReplyType> {
    const twoFa = await twoFA.analysis.context(
        user,
        context,
        cryptographic_token
    );

    if (!twoFa.valid) {
        return software.methods.serverReply(404, twoFa.reason || "No matching 2FA request found.");
    }

    const twoFALog = twoFa.existing!;
    if (twoFALog.used.is_used || twoFALog.state === "REQUEST_SENT" || twoFALog.state === "REQUEST_COMPLETED") {
        return software.methods.serverReply(400, "This 2FA request has already been used.");
    }

    // 8-digit code generation
    const code = Math.floor(10000000 + Math.random() * 90000000).toString();

    const u = await twoFA.logs.update(twoFALog.id, "REQUEST_SENT", {
        code: code,
        used: {
            is_used: false
        }
    });

    if (!u.success) {
        return software.methods.serverReply(500, "Failed to generate 2FA code.");
    }

    await mailing.send(
        "Naflows Authenticator <no-reply@auth.naflows.com>",
        user.email,
        "Your Naflows 2FA Code",
        await mailing.patterns.customCode(user, "auth.naflows.com", code)
    )

    return software.methods.serverReply(200, "2FA code generated successfully.");
}