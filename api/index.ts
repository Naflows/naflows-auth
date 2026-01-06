require('dotenv').config();
import axios from 'axios';
import cors from 'cors';

const express = require('express');
const fingerprint = require('express-fingerprint');
const cookieParser = require('cookie-parser');
const app = express();
const bodyParser = require('body-parser');


app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:8080', 'https://nass.naflows.com', 'http://localhost:3005', "http://localhost:3001"  // Add this
    ],
    credentials: true
}));
app.use(fingerprint({
    parameters: [
        fingerprint.useragent,
        fingerprint.acceptHeaders,
        fingerprint.geoip
    ]
}));

// Allow large payloads (for image uploads)
// Is this a security risk? Should we limit it to 50mb?
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Middleware to return req url
import { Request, Response, NextFunction } from 'express';
import service from './init';
import { manageConnection, sendCookies } from './modules';
// when coming from a proxy (e.g. connecting to frontend.com/api the proxy will return correct link without /api/), the request is rejected because of a typerror where the URL is invalid. How to fix that?
app.use((req: Request, _res: Response, next: NextFunction) => {
    // Check for the proxy path prefix, e.g., '/api'
    if (req.url.startsWith('/api')) {
        // Strip the prefix to get the correct path
        req.url = req.url.substring('/api'.length);
    }
    next();
});

app.get('/', (req, res) => {
    res.send('Hello from Dummy API');
});



app.get('/public/status-check', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/public/status');
});

app.get('/public/generate-api-id', async (req: Request, res: Response) => {
    // This generates API IDs for third-party services to connect to Naflows when creating a service
    console.log("Generating new API ID for service creation...");
    const newKey = await axios.post(`${process.env.AUTH_API_URL_DEV}/public/services/generate-api-id`, {
        client: service
    });
    res.status(newKey.status).json(newKey.data);
});

app.get('/public/data/plans.json', async (req: Request, res: Response) => {
    // This endpoint is used to fetch plans for service creation page
    const f = await axios.post(`${process.env.AUTH_API_URL_DEV}/public/services/plans`, {
        client: service
    });
    res.status(f.status).json(f.data);
});


app.get('/public/user/:username', async (req: Request, res: Response) => {
    const username = req.params.username;
    await manageConnection(req,res,"/public/global/user/", {
        username: username
    }, "POST");
});

app.get('/public/user/id/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    await manageConnection(req,res,"/public/global/user/id/", {
        id: id
    }, "POST");
});

app.get('/public/subscribe-mailing', async (req: Request, res: Response) => {
    const email = req.query.email;
    if (email == undefined || typeof email !== 'string' || email.length < 5 || !email.includes('@')) {
        return res.status(400).json({ status: 400, message: "Invalid email address.", success: false });
    }

    const f = await axios.post(`${process.env.AUTH_API_URL_DEV}/public/mailing/subscribe`, {
        email: email,
        client: service,
        request: {
            method: req.method,
            url: req.originalUrl,
            headers: req.headers,
            request_date: Date.now()
        }
    });
    res.status(f.status).json(f.data);
});

app.get('/public/services/:id/infos/:userID', async (req: Request, res: Response) => {
    const serviceID = req.params.id;
    const userID = req.params.userID;
    console.log("Public service info requested for ID:", serviceID);
    const f = await axios.post(`${process.env.AUTH_API_URL_DEV}/public/services/service-informations`, {
        service: {
            id: serviceID,
            userID: userID || null
        },
        client: service,
        request: {
            method: req.method,
            url: req.originalUrl,
            headers: req.headers,
            request_date: Date.now()
        }
    });

    console.log("Public service information response from NASS:", f.data);
    sendCookies(res, f.data);

    delete f.data.data.middleware;

    res.status(f.status).json(f.data.data.service);
});


app.post('/nass/instance/connect', async (req: Request, res: Response) => {

    await manageConnection(req,res,'/nass/user/instance/connect', { 
        serviceID: req.body.serviceID
    });
});

app.post('/user/secure/service/rights/assign', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/services/rights/assign', { 
        rightsIDs: req.body.rightsIDs,
        serviceID: req.body.serviceID,
        userID: req.body.userID,
    });
});





app.post('/user/secure/service/update', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/services/update/description', {
        service: req.body.serviceDetails
    });
});

app.post('/user/secure/service/legal/update', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/services/data/update', {
        service_id: req.body.service_id,
        markdown: req.body.markdown,
        type: req.body.type // "privacy_policy_url" | "terms_of_service_url" | "contact_email"
    });
});

app.post('/user/secure/service/logs', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/services/get-logs', {
        service_id: req.body.service_id,
        limit: req.body.limit,
        offset: req.body.offset,
        filters: req.body.filters
    });
});

app.post('/user/secure/service/users', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/services/get-users', {
        service_id: req.body.service_id
    });
});

app.post('/user/secure/service/traffic', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/services/get-traffic', {
        service_id: req.body.service_id
    });
});



app.post('/user/secure/service/rights/create', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/services/rights/create', { 
        service_id: req.body.service_id,
        name: req.body.name,
        type: req.body.type,
        deletable: req.body.deletable,
        rights: req.body.rights
    });
});
app.post('/user/secure/service/rights/delete', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/services/rights/delete', { 
        service_id: req.body.service_id,
        right_id: req.body.right_id
    });
});


app.post('/user/secure/service/key/get', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/services/service/key', { 
        service_id: req.body.service_id
    });
});

app.post('/user/secure/service/rights/get', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/services/rights/get', { 
        service_id: req.body.service_id
    });
});

app.post('/user/secure/service/rights/update', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/services/rights/update', { 
        serviceID: req.body.serviceID,
        rights: req.body.rights,
        type: req.body.type
    });
});

app.post('/user/secure/service/register', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/user/register-in-api', {
        code: req.body.code,
        serviceID: req.body.serviceID
    });
});


app.post('/user/secure/service/policies/set', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/services/set-policies', {
        service_id: req.body.service_id,
        policies: req.body.policies
    });
});
app.post('/user/secure/service/public-details/update', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/services/update/public-details', {
        service_id: req.body.service_id,
        details: req.body.details
    });
});

app.post('/user/secure/2FA/create', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/2FA/generate-request', { 
        action: req.body.action,
        data: req.body.data
    });
});
app.post('/user/secure/2FA/generate-code', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/2FA/generate-code', { 
        action: req.body.action,
        data: req.body.data
    });
});
app.post('/user/secure/2FA/clear-cookie', async (req: Request, res: Response) => {
    res.clearCookie("2fa_cryptographic_token", { httpOnly: true, secure: true, sameSite: 'None' });
    res.status(200).json({ status: 200, message: "2FA cryptographic token cookie cleared.", success: true });
});
app.post('/user/secure/2FA/verify-code', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/2FA/verify-code', { 
        action: req.body.action,
        data: req.body.data,
        code: req.body.code
    });
});
app.post('/user/secure/2FA/socket-status', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/2FA/socket-status', { 
        action: req.body.action,
        data: req.body.data
    });
});

app.post('/user/secure/services/can-access', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/services/user/check-access', { 
        service_id: req.body.service_id
    });
});


app.post('/user/secure/confirm-identity/send-code', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/user/send-verification-code', { 
        serviceID: req.body.serviceID
    });
});
app.post('/user/secure/register', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/user/register', { 
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthdate: req.body.birthdate
    });
});

app.get('/get-user-info/services/:id/service-informations', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/data/services/service-informations', {
        service:{
            id :  req.params.id
        }
    });
});


app.get('/get-user-info/services', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/data/services');
});

app.get('/get-user-info/user', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/data/user');
});

app.post('/set-user-info/notifications/mark-as-read', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/user/notifications/mark-as-read', { 
        notificationId: req.body.notificationId
    });
});

app.post('/client/secure/session-check', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/session-check');
});

app.post('/get-user-info/notifications', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/data/notifications', {
        start: req.query.start || 0
    });
});



app.put('/set-user-info/user/update', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/user/update', {
        userDetails: req.body.userDetails
    }, "PUT");
});

app.post('/set-user-info/services/create', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/secure/data/services/build', {
        service : req.body.details 
    });
});


// THIS IS A PIPE USED LATER TO COMMUNICATE WITH NASS
// THIS PIPE IS TO BE USED BY ANY SERVICE THAT NEEDS TO AUTHENTICATE A USER
// IT WILL FORWARD THE REQUEST TO NASS AND RETURN THE RESPONSE
// IT WILL ALSO SET THE COOKIES RECEIVED FROM NASS

app.post('/send-login-request', async (req: Request, res: Response) => {
    const { user_id, password, identifier } = req.body;

    try {
        const f = await axios.post(`${process.env.AUTH_API_URL_DEV}/client/login`, {
            user: {
                password,
                identifier,
                ip: req.ip,
                agent: req.headers['user-agent'],
                device_fingerprint: req.fingerprint
            },
            request: {
                method: req.method,
                url: req.originalUrl,
                headers: req.headers,
                request_date: Date.now()
            },
            client: service
        });

        // Get session and token from f.data
        const session = f.data.data.session;
        const token = f.data.data.token;
        const uid = f.data.data.user_id;

        res.cookie("session", session, { httpOnly: true, secure: true, sameSite: 'None' });
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'None' });
        res.cookie("uid", uid, { httpOnly: true, secure: true, sameSite: 'None' });

        console.log("'\x1b[33m%s\x1b[0m'", "Cookies set from login response: " + JSON.stringify({ session, token, uid }));

        res.status(f.status).json(f.data);


    } catch (error: any) {
        res.status(error?.response?.status || 500).json({
            error: error?.response?.data || 'Internal Server Error'
        });
    }
});


app.post('/client/logout', async (req: Request, res: Response) => {
    await manageConnection(req,res,'/client/logout');
});


const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Dummy API is running on http://localhost:${PORT}\nCommunication with NASS : ${process.env.AUTH_API_URL_DEV}\nLast update : 15:53 25/09/2025`);
});

