import { Request, Response } from 'express';
import secure from '../dir';
import { Service, Tokens, User, UserSession } from '../../../types/.types/collections.type';
import { services } from '../../services/dir';
import UCRType from '../../../types/.types/ucr.type';
import middleware from '../../../middleware/dir';
import { ReplyType } from '../../../types/.types/reply.type';
import { Session } from 'inspector/promises';
import mailing from '../../../software/mailing/dir';
import { software } from '../../../software/dir';
import { db } from '../../..';

export default async function logUserIn(req: Request, res: Response) {

    const serviceOk = await middleware.process.scv(req, res);

    if (!serviceOk) {
        return res.status(403).send("Unauthorized service access.");
    }


    const {
        user,
        service
    } = req.body;

    if (user.id == "" || user.password == "" || user.identifier == "") {
        return software.methods.serverReply(400, "Missing user credentials");
    }

    const credentialsOk: boolean = await secure.user.credentials(user.user_id, user.password, user.identifier);
    const _user: User = await secure.user.get(user.user_id);

    const associatedSession = await secure.session.find(
        _user.id,
        user.ip,
        user.agent
    );




    if (credentialsOk) {
        if (associatedSession) {
            if (associatedSession.active && (associatedSession.expires_at > Date.now())) {
                const token = await secure.token.get(associatedSession.token_id);

                const newSessionID : ReplyType = await secure.session.renew(associatedSession.id, {
                    sessionsCollection: db.collection("sessions"),
                    tokensCollection: db.collection("tokens")
                });

                if (!newSessionID.success || !(newSessionID.data as any)?.session) return software.methods.serverReply(500, "Failed to renew session.");

                const newTokenID : ReplyType = await secure.token.renew(
                    token.id,
                    _user.id,
                    (newSessionID.data as any)?.session
                );

                if (!newTokenID.success || !(newTokenID.data as any)?.token) return software.methods.serverReply(500, "Failed to renew token.");

                res.cookie("session", JSON.stringify({
                    session_id: (newSessionID.data as any)?.session.id,
                }), { httpOnly: true });
                res.cookie("token", JSON.stringify({
                    token: (newTokenID.data as any)?.token,
                }), { httpOnly: true });


                return software.methods.serverReply(200, "Login successful", {
                    session: associatedSession.id,
                    token: (newTokenID.data as any)?.token
                });
            } else {
                return software.methods.serverReply(401, "Login failed - session is not active");
            }
        } else {

            const s: ReplyType = await services.service.get(service.service) as ReplyType;

            if (!s.success) {
                return software.methods.serverReply(404, "Unable to find the service you are looking for. Are you sure it exists?");
            }

            const _service: Service = s.data as Service;


            const data: ReplyType = await secure.session.create(
                _user,
                user.device_fingerprint,
                user.agent,
                user.ip,
                _service.id
            );

            const session: UserSession = data.data as UserSession;

            if (!data.success || !session) {
                return software.methods.serverReply(401, "Failed creating the session, please try again.");
            }

            const tokenData: ReplyType = await secure.token.create(
                _user, session, ["SESSION_CONFIRMATION"], false, 1, null, 60 * 10 * 1000
            );



            const token = tokenData.data as {
                token: string, token_id: string
            };


            if (!tokenData.success || !token) {
                return software.methods.serverReply(401, "Login failed - token creation failed");
            }

            const emailSent = await mailing.send(
                _service.name,
                _user.email,
                `Account confirmation needed for ${_service.name}`,
                (await mailing.patterns.customLink(`${process.env.SELF_API_URL}/client/account/confirm?tokenid=${token.token_id}&tokenvalue=${token.token}`, _user, _service.name))
            );

            if (!emailSent) {
                return software.methods.serverReply(500, "Failed to send confirmation email.");
            }


            res.cookie("session", JSON.stringify({
                session_id: session.id,
            }), { httpOnly: true });
            res.cookie("token", JSON.stringify({
                token: token.token,
                token_id: token.token_id
            }), { httpOnly: true });

            return software.methods.serverReply(401, "An email has been sent with the confirmation code. You will be redirected to the confirmation page in a few moments.");
        }
    } else {
        return software.methods.serverReply(401, "Login failed - invalid credentials");
    }
}