import express from 'express';
import middleware from '../middleware/dir';
const bodyParser = require('body-parser');

export function useApp(app) {
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(async (req, res, next) => {
        console.log(`Request received at ${req.path}`);
        
        // Check if  the request path contains "/client"
        if (req.path.startsWith('/client') || req.path.startsWith('/contract-debug')) {
            // Continue 
            next();
        } else {
            middleware.main(req, res, next);
        }
    });

}