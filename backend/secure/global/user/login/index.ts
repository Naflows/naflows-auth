import { Request, Response } from 'express';
import secure from '../../dir';
import { Service, Tokens, User, UserSession } from '../../../../types/.types/collections.type';
import { services } from '../../../services/dir';
import UCRType from '../../../../types/.types/ucr.type';
import middleware from '../../../../middleware/dir';
import { ReplyType } from '../../../../types/.types/reply.type';
import { Session } from 'inspector/promises';
import mailing from '../../../../software/mailing/dir';
import { software } from '../../../../software/dir';
import { db } from '../../../..';
import { acceptLogin } from './modules/accept-login';
import { manageNewSession } from './modules/manage-new-session';
import notifications from '../../../../software/notifications/dir';



function readableUserAgent(userAgent: string): string {
    // Basic parsing of user agent string to make it more readable
    if (userAgent.includes("Firefox")) {
        return "Mozilla Firefox";
    } else if (userAgent.includes("Chrome")) {
        return "Google Chrome";
    } else if (userAgent.includes("Safari")) {
        return "Apple Safari";
    } else if (userAgent.includes("Edge")) {
        return "Microsoft Edge";
    } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
        return "Opera";
    } else if (userAgent.includes("Trident") || userAgent.includes("MSIE")) {
        return "Internet Explorer";
    } else if (userAgent.includes("Android")) {
        return "Android Browser";
    } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
        return "iOS Safari";
    } else if (userAgent.includes("Mozilla")) {
        return "Mozilla";
    }
    return "Unknown Browser";
}

export default async function logUserIn(req: Request, res: Response): Promise<ReplyType> {
    req.body.client.session_id = null; // Ensure no session is sent in the client data for login requests.
    const serviceOk = await middleware.process.scv(req, res);

    if (!serviceOk) {
        return res.status(403).send("Unauthorized service access.");
    }




    const {
        user,
        client
    } = req.body;

    if (user.id == "" || user.password == "" || user.identifier == "") {
        return software.methods.serverReply(400, "Some user credentials are missing. Please provide all required information.");
    }

    const credentialsOk: boolean = await secure.user.credentials(user.user_id, user.password, user.identifier);
    const _user: User = await secure.user.get(user.user_id, false);

    if (!_user) {
        return software.methods.serverReply(404, "User not found when attempting to log in.");
    }

    const associatedSession = await secure.session.find(
        _user.id,
        user.ip,
        user.agent
    );

    if (!associatedSession) {
        console.log("No existing session found for this login request.");
        if (credentialsOk) {
            console.log("Credentials are valid, proceeding to create a new session.");
            const r: ReplyType = await manageNewSession(_user, user, client);
            return r;
        }

    }

    if (associatedSession.token_id === '') {
        console.log("No token associated with the session.");
        const token: ReplyType = await secure.token.create(
            _user,
            associatedSession,
            [], // Rights are deprecated here
            true,
            parseInt(process.env.STV_MAXIMAL_USE_RATES) // Default to 1 use if not specified
        );
        if (token.success) {
            // Update the session with the new token ID
            await db.collection("sessions").updateOne(
                { id: associatedSession.id },
                { $set: { token_id: secure.hash((token.data as any).token_id) } }
            );
            console.log("New token created and associated with the session:", token.data);
        } else {
            console.error("Failed to create token for the session during login process:", token.message);
        }
    }

    console.log("Associated Session:", associatedSession);

    if (credentialsOk) {
        if (associatedSession && associatedSession.active || (!associatedSession && process.env.DEV_SKIP_SESSION_CONFIRMATION === "true")) {
            // Notify user
            console.log(req.body.request.headers)
            const notification = await notifications.create(
                _user.id,
                "INFO",
                {
                    title: "Someone tried to log in to your account",
                    message: `
                            Here are the details of the login attempt:<br/>
                            - IP Address: ${req.ip} <br/>
                            - Device informations: ${readableUserAgent(req.body.request.headers['user-agent'] || 'Unknown')} on ${req.body.request.headers["sec-ch-ua-platform"]} <br/>
                            - Time: ${new Date().toLocaleString('en-US', { timeZone: 'UTC', hour12: true })} UTC <br/>
                            <br />
                            If this was you, you can safely ignore this message. If you did not initiate this login, please secure your account immediately.
                    `,
                    link: 'https://nass.naflows.com/account/security'
                },
                true
            );

            // If a session exists, create a new one in order to manage auto-logout of previous sessions
            console.log("Creating a new session to manage auto-logout of previous sessions.");
            const r: ReplyType = await manageNewSession(_user, user, client);
            return r;

        }

        if (associatedSession) {
            if (associatedSession.active) {
                const r: ReplyType = await acceptLogin(_user, associatedSession);
                return r;
            } else {
                // Delete the inactive session
                await db.collection("sessions").deleteOne({ id: associatedSession.id });
                console.log("Deleted inactive session:", associatedSession.id);
                return software.methods.serverReply(401, "Login failed, the session associated with this login request is no longer active. Please initiate a new login request.");
            }
        }
    } else {
        return software.methods.serverReply(401, "The provided credentials are incorrect. Please try again with valid information or reset your password.");
    }
}