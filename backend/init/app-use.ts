import express from 'express';
import middleware from '../middleware/dir';
const bodyParser = require('body-parser');
import cors from 'cors';
import secure from '../secure/global/dir';
import { ReplyType } from '../types/.types/reply.type';
import { software } from '../software/dir';
import nass from '../nass/dir';
import { services } from '../secure/services/dir';
import { v4 } from 'uuid';




/*
    This function is based on the express framework and sets up middleware for handling JSON requests,
    URL-encoded data, and CORS. It also includes custom middleware for request logging, service validation,
    and secure user authentication.
    @context backend/init/app-use.ts
*/
export function useApp(app) {
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());

    app.use(async (req, res, next) => {



        if (req.path.startsWith('/nass/dev/instance')) {
            // Bypass middleware for instance management routes but check developer validity
            const devCheck = await services.service.dev.login(req.body.apiID, req.body.devKey);
            if (!devCheck.success) {
                return res.status(devCheck.status).json(devCheck);
            }
            next();
            return;
        }
        else if (req.path.startsWith('/nass/instance')) {
            next();
            return;
        }

        req.middleware = { data: {} } as any;
        console.log("\x1b[33m%s\x1b[0m", `Request received: ${req.method} ${req.path} with body: ${JSON.stringify(req.body)}`);
        if (req.body && req.body.client) {
            req.body.client.ip = req.ip;
        }

        // If the request path starts with "/client" or "/public"
        if (req.path.startsWith('/client') || req.path.startsWith('/public') || req.path.startsWith('/nass/user')) {
            // Continue 

            async function checkService() {
                const checkService: ReplyType = await middleware.process.scv(req, res);

                console.log("NASS SCV Process result:", checkService);

                if (!checkService.success) {
                    return res.status(checkService.status).json(checkService);
                }
            }

            if (req.path.startsWith('/client/secure') || req.path.startsWith('/nass/user')) {
                await checkService();

                let preventMiddlewareReload = req.path.startsWith('/client/secure/session-check');

                const secureLogin: ReplyType = (await secure.user.hiddenLogin(req, res, preventMiddlewareReload));

                if (!secureLogin.success) {
                    return res.status(secureLogin.status).json(secureLogin);
                } else {
                    console.log('\x1b[32m%s\x1b[0m', `Secure route accessed: ${req.path}`);
                    req.middleware.data = {
                        session: (secureLogin.data as any)?.session,
                        token: (secureLogin.data as any)?.token,
                        user_id: (secureLogin.data as any)?.user_id
                    };



                    console.log('\x1b[33m%s\x1b[0m', `Middleware access granted for secure route - Sending back middleware data: ${JSON.stringify(req.middleware.data)}`);
                }
            } else if (req.path.startsWith('/public/nass')) {
                // Continue
            } else if (req.path.startsWith('/public')) {
                if (process.env.NASS_SERVICE_FILTER == "true") {
                    const serviceOk = await middleware.check.origin(req.body.client);
                    if (!serviceOk.success) {
                        return res.status(serviceOk.status).json(serviceOk);
                    }
                }

                console.log('\x1b[32m%s\x1b[0m', `Public route accessed: ${req.path}`);
            }

            next();


        } else {
            middleware.main(req, res, next);
        }
    });

}