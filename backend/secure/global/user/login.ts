import { Request, Response } from 'express';
import secure from '../dir';
import { Service } from '../../../types/.types/collections.type';
import { services } from '../../services/dir';
import UCRType from '../../../types/.types/ucr.type';
import middleware from '../../../middleware/dir';

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

    const associatedSession = await secure.session.find(
        user.user_id,
        user.ip,
        user.agent
    );




    if (credentialsOk) {
        if (associatedSession) {
            res.status(200).send("Login successful");
        } else {

            const newCode = Math.floor(100000 + Math.random() * 900000).toString();


            res.status(401).send("Login failed - session not found");
        }
    } else {
        res.status(401).send("Login failed - invalid credentials");
    }
}