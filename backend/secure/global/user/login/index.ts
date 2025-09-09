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

export default async function logUserIn(req: Request, res: Response) : Promise<ReplyType> {

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
    const _user: User = await secure.user.get(user.user_id, false);

    const associatedSession = await secure.session.find(
        _user.id,
        user.ip,
        user.agent
    );

    console.log("Associated Session:", associatedSession);

    if (credentialsOk) {
        if (associatedSession) {
            if (associatedSession.active) {
                const r: ReplyType = await acceptLogin(_user, associatedSession);
                return r;
            } else {
                return software.methods.serverReply(401, "Login failed - session is not active");
            }
        } else {
            const r: ReplyType = await manageNewSession(_user, user, service);
            return r;
        }
    } else {
        return software.methods.serverReply(401, "Login failed - invalid credentials");
    }
}