import express from 'express';
import middleware from '../middleware/dir';
const bodyParser = require('body-parser');
import cors from 'cors';
import secure from '../secure/global/dir';

export function useApp(app) {
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());
    app.use(async (req, res, next) => {
        // Check if  the request path contains "/client"
        if (req.path.startsWith('/client') || req.path.startsWith('/public') || req.path.startsWith('/contract-debug')) {
            // Continue 
            if (req.path.startsWith('/client/account')) {
                const secureLogin = (await secure.user.hiddenLogin(req, res));
                if (!secureLogin.success) {
                    return res.status(secureLogin.status).json(secureLogin);
                }
            }

            next();
        } else {
            middleware.main(req, res, next);
        }
    });

}