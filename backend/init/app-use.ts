import express from 'express';
import middleware from '../middleware/dir';
const bodyParser = require('body-parser');
import cors from 'cors';
import secure from '../secure/global/dir';
import { ReplyType } from '../types/.types/reply.type';

export function useApp(app) {
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());
    app.use(async (req, res, next) => {
        req.middleware = { data: {} } as any;
        // If the request path starts with "/client" or "/public"
        if (req.path.startsWith('/client') || req.path.startsWith('/public')) {
            // Continue 
            if (req.path.startsWith('/client/secure')) {
                const secureLogin : ReplyType = (await secure.user.hiddenLogin(req, res));
                if (!secureLogin.success) {
                    return res.status(secureLogin.status).json(secureLogin);
                } else {
                    req.middleware.data = {
                        session: (secureLogin.data as any)?.session,
                        token: (secureLogin.data as any)?.token,
                        user_id: (secureLogin.data as any)?.user_id
                    };
                    console.log('\x1b[33m%s\x1b[0m', `Middleware access granted for secure route - Sending back middleware data: ${JSON.stringify(req.middleware.data)}`);
                }
            }

            next();
        } else {
            middleware.main(req, res, next);
        }
    });

}