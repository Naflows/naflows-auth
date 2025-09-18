import express from 'express';
import middleware from '../middleware/dir';
const bodyParser = require('body-parser');
import cors from 'cors';
import secure from '../secure/global/dir';
import { ReplyType } from '../types/.types/reply.type';
import { software } from '../software/dir';

export function useApp(app) {
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());
    app.use(async (req, res, next) => {
        req.middleware = { data: {} } as any;
        console.log("\x1b[33m%s\x1b[0m", `Request received: ${req.method} ${req.path} with body: ${JSON.stringify(req.body)}`);
        if (req.body.client.ip == undefined) {
            req.body.client.ip = req.ip;
        }

        // If the request path starts with "/client" or "/public"
        if (req.path.startsWith('/client') || req.path.startsWith('/public')) {
            // Continue 
            if (req.path.startsWith('/client/secure')) {
                const secureLogin: ReplyType = (await secure.user.hiddenLogin(req, res));
                const checkService: ReplyType = await middleware.process.scv(req, res);
                if (!secureLogin.success) {
                    return res.status(secureLogin.status).json(secureLogin);
                } else if (!checkService.success) {
                    return res.status(checkService.status).json(checkService);
                } else {
                    console.log('\x1b[32m%s\x1b[0m', `Secure route accessed: ${req.path}`);
                    req.middleware.data = {
                        session: (secureLogin.data as any)?.session,
                        token: (secureLogin.data as any)?.token,
                        user_id: (secureLogin.data as any)?.user_id
                    };
                    console.log('\x1b[33m%s\x1b[0m', `Middleware access granted for secure route - Sending back middleware data: ${JSON.stringify(req.middleware.data)}`);
                }
            } else if (req.path.startsWith('/public')) {
                const serviceOk = await middleware.check.origin(req.body.client);
                if (!serviceOk.success || req.body.client.service !== process.env.AUTH_API_SERVICE_NAME) {
                    return res.status(403).json(software.methods.serverReply(403, "Forbidden: Invalid client origin."));
                }

                console.log('\x1b[32m%s\x1b[0m', `Public route accessed: ${req.path}`);
            }

            next();
        } else {
            middleware.main(req, res, next);
        }
    });

}