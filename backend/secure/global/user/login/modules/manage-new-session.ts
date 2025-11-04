
/*

    This function is used to manage login request in a new session.

*/

import { software } from "../../../../../software/dir";
import mailing from "../../../../../software/mailing/dir";
import { Service, User, UserSession } from "../../../../../types/.types/collections.type";
import { ReplyType } from "../../../../../types/.types/reply.type";
import secure from "../../../dir";
import { services } from "../../../../services/dir";

export async function manageNewSession(
    _user: User, user: any, service: any
) {


    const s: ReplyType = await services.service.get(service.service) as ReplyType;

    if (!s.success) {
        return software.methods.serverReply(404, "Unable to find the service you are looking for. Are you sure it exists?");
    }

    const _service: Service = s.data.service as Service;


    const data: ReplyType = await secure.session.create(
        _user,
        user.device_fingerprint,
        user.agent,
        user.ip,
        _service.id
    );

    const session: UserSession = data.data.session as UserSession;

    if (!data.success || !session) {
        return software.methods.serverReply(401, "Failed creating the session, please try again.");
    }

    let tokenData: ReplyType;
    if (process.env.DEV_SKIP_SESSION_CONFIRMATION === "true") {
        // If skipping confirmation, create a full access token
        tokenData = await secure.token.create(
            _user, session, [], true, parseInt(process.env.STV_MAXIMAL_USE_RATES), null, parseInt(process.env.SESSION_TOKEN_DURATION)
        );

        if (!tokenData.success) {
            return software.methods.serverReply(500, "Failed to create token for session.");
        }

        // Associate the token with the session
        session.token_id = secure.hash((tokenData.data as any).token_id);
        // Update the session in the database
        const uR: ReplyType = await secure.session.update(session.id, session);
        if (!uR.success) return software.methods.serverReply(500, "Failed to update session with token.");

        console.log("Session to confirm skipped");
    } else {
        tokenData = await secure.token.create(
            _user, session, ["SESSION_CONFIRMATION"], false, 1, null, 60 * 10 * 1000
        );
    }



    const token = tokenData.data as {
        token: string, token_id: string
    };


    if (!tokenData.success || !token) {
        return software.methods.serverReply(401, "Login failed - token creation failed");
    }

    if (process.env.DEV_SKIP_SESSION_CONFIRMATION === "true") {
        return software.methods.serverReply(200, "Login successful", {
            session: session.id,
            token: token.token,
            user_id: _user.id
        });
    } else {
        const emailSent = await mailing.send(
            _service.name,
            _user.email,
            `Account confirmation needed for ${_service.name}`,
            (await mailing.patterns.customLink(`${process.env.SELF_API_URL}/client/account/confirm?tokenid=${token.token_id}&tokenvalue=${token.token}`, _user, _service.name))
        );

        if (!emailSent.success) {
            return software.methods.serverReply(500, "Failed to send confirmation email.");
        }

        // Log in console the session that needs to be confirmed
        const k = await secure.session.get(session.id, false);
        console.log("Session to confirm:", k);

        const emailParts = _user.email.split("@");
        const truncatedEmail = emailParts[0].slice(0, 2) + "****@" + emailParts[1];
        return software.methods.serverReply(202, `An email has been sent to ${truncatedEmail} with the confirmation code.`, {
            session: session.id,
            token: token.token

        });
    }

}