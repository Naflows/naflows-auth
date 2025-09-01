import { Request, Response } from 'express';
import secure from '../dir';
import { Service, Tokens, User, UserSession } from '../../../types/.types/collections.type';
import { services } from '../../services/dir';
import UCRType from '../../../types/.types/ucr.type';
import middleware from '../../../middleware/dir';
import { ReplyType } from '../../../types/.types/reply.type';
import { Session } from 'inspector/promises';
import mailing from '../../../software/mailing/dir';

export default async function logUserIn(req: Request, res: Response) {
    const serviceOk = await middleware.process.scv(req, res);

    if (!serviceOk) {
        return res.status(403).send("Unauthorized service access.");
    }


    const {
        user,
        service
    } = req.body;
    const credentialsOk: boolean = await secure.user.credentials(user.user_id, user.password, user.identifier);
    const _user : User = await secure.user.get(user.user_id);

    const associatedSession = await secure.session.find(
        _user.id,
        user.ip,
        user.agent
    );




    if (credentialsOk) {
        if (associatedSession) {
            res.status(200).send("Login successful");
        } else {

            const s : ReplyType = await services.service.get(service.service) as ReplyType;

            if (!s.success) {
                return res.status(404).send(`Unable to find the service you are looking for. Are you sure it exists?`);
            }

            const _service : Service = s.data as Service;


            const data : ReplyType = await secure.session.create(
                user.user_id,
                user.device_fingerprint,
                user.agent,
                user.ip,
                _service.id
            );

            const session : UserSession = data.data as UserSession;

            if (!data.success || !session) {
                return res.status(401).send("Failed creating the session, please try again.");
            }

            const tokenData : ReplyType = await secure.token.create(
                _user, session, ["SESSION_CONFIRMATION"], false, 1
            );

            const token : Tokens = tokenData.data as Tokens;

            if (!tokenData.success || !token) {
                return res.status(401).send("Login failed - token creation failed");
            }

            const emailSent = await mailing.send(
                _user.email,
                `Account confirmation needed for ${_service.name}`,
                (await mailing.patterns.customLink(`${process.env.SELF_API_URL}/client/account/confirm?token=${token.id}&value=${token.token}`, _user, _service.name))
            );

            if (!emailSent) {
                return res.status(500).send("Failed to send confirmation email.");
            }


            res.cookie("session", JSON.stringify({
                session_id : session.id,
                active : false
            }), { httpOnly: true });
            res.cookie("token", token.id, { httpOnly: true });
            res.status(401).send("An email has been sent with the confirmation code. You will be redirected to the confirmation page in a few moments.");
        }
    } else {
        res.status(401).send("Login failed - invalid credentials");
    }
}