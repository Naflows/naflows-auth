require('dotenv').config();
import axios from 'axios';
import cors from 'cors';

const express = require('express');
const fingerprint = require('express-fingerprint');
const cookieParser = require('cookie-parser');
const router = express.Router();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:8080', 'https://nass.naflows.com', 'http://localhost:3005'  // Add this
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



app.use(express.urlencoded({ extended: true }));

// Middleware to return req url
import { Request, Response, NextFunction } from 'express';
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

function getCookieValue(cookies: string, name: string): string | null {
    const match = cookies.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
    return match ? match[1] : null;
}

// 'User info response from NASS: {"status":200,"message":"Secure data access granted","success":true,"data":{"session":"42b2bc07-5341-4743-9595-9180bde8631d","token":"63d8b340-3ce3-46a9-b457-098bfa903ac2","user_id":"1"}}'


// Setting cookies: { token: undefined, session: undefined, uid: undefined }

function sendCookies(res, data) {
    const token = data.data.middleware.token;
    const session = data.data.middleware.session;
    const uid = data.data.middleware.user_id;
    console.log("Setting cookies:", { token, session, uid });
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'None' });
    res.cookie("session", session, { httpOnly: true, secure: true, sameSite: 'None' });
    res.cookie("uid", uid, { httpOnly: true, secure: true, sameSite: 'None' });
}

function getCookies(req) {
    const cookies = req.headers.cookie || '';
    const sessionID = getCookieValue(cookies, 'session');
    const token = getCookieValue(cookies, 'token');
    const uid = getCookieValue(cookies, 'uid');
    console.log("'\x1b[33m%s\x1b[0m'", "Cookies received: " + JSON.stringify({ sessionID, token, uid }));

    return { sessionID, token, uid };
}


const service = {
    service: "naflows_backend",
    service_token: "naflows_backend_token",
    service_token_birth: new Date("2025-09-01").getTime()
}

app.get('/public/status-check', async (req: Request, res: Response) => {
    const f = await axios.post(`${process.env.AUTH_API_URL_DEV}/public/status`, {
        client: service
    });
    res.status(f.status).json(f.data);
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


app.get('/get-user-info/services/:id/service-informations', async (req: Request, res: Response) => {
    const { sessionID, token, uid } = getCookies(req);
    const serviceID = req.params.id;
    console.log("Service ID requested:", serviceID);

    const f = await axios.post(`${process.env.AUTH_API_URL_DEV}/client/secure/data/services/service-informations`, {
        user: {
            ip: req.ip,
            agent: req.headers['user-agent'],
            device_fingerprint: req.fingerprint,
            session_id: sessionID || null,
            token: token || null,
            user_id: uid || null,
        },
        service: {
            id: serviceID
        },
        request: {
            method: req.method,
            url: req.originalUrl,
            headers: req.headers,
            request_date: Date.now()
        },
        client: service
    });


    sendCookies(res, f.data);

    delete f.data.data.middleware;
    console.log("Service information response from NASS:", f.data);

    res.status(f.status).json(f.data);

});

app.get('/get-user-info/services', async (req: Request, res: Response) => {
    const { sessionID, token, uid } = getCookies(req);

    const f = await axios.post(`${process.env.AUTH_API_URL_DEV}/client/secure/data/services`, {
        user: {
            ip: req.ip,
            agent: req.headers['user-agent'],
            device_fingerprint: req.fingerprint,
            session_id: sessionID || null,
            token: token || null,
            user_id: uid || null,
        },
        client: service,
        request: {
            method: req.method,
            url: req.originalUrl,
            headers: req.headers,
            request_date: Date.now()
        }
    });

    console.log("Services list response from NASS:", f.data);

    sendCookies(res, f.data);

    delete f.data.data.middleware;

    res.status(f.status).json(f.data);

});

app.get('/get-user-info/user', async (req: Request, res: Response) => {
    const { sessionID, token, uid } = getCookies(req);

    const f = await axios.post(`${process.env.AUTH_API_URL_DEV}/client/secure/data/user`, {
        user: {
            ip: req.ip,
            agent: req.headers['user-agent'],
            device_fingerprint: req.fingerprint,
            session_id: sessionID || null,
            token: token || null,
            user_id: uid || null,
        },
        request: {
            method: req.method,
            url: req.originalUrl,
            headers: req.headers,
            request_date: Date.now()
        },
        client: service
    });


    sendCookies(res, f.data);

    delete f.data.data.middleware;

    res.status(f.status).json(f.data);

});


app.post('/set-user-info/services/create', async (req: Request, res: Response) => {
    const { sessionID, token, uid } = getCookies(req);
    const details = req.body.details;

    console.log("Service creation details received:", details);

    if (!details || !details.public || !details.configuration) {
        console.log("Bad Request: Missing service details.");
        return res.status(400).json({ status: 400, message: "Bad Request: Missing service details.", success: false });
    }

    const f = await axios.post(`${process.env.AUTH_API_URL_DEV}/client/secure/data/services/build`, {
        user: {
            ip: req.ip,
            agent: req.headers['user-agent'],
            device_fingerprint: req.fingerprint,
            session_id: sessionID || null,
            token: token || null,
            user_id: uid || null,
        },
        service: details,
        request: {
            method: req.method,
            url: req.originalUrl,
            headers: req.headers,
            request_date: Date.now()
        },
        client: service
    });


    sendCookies(res, f.data);

    delete f.data.data.middleware;

    res.status(f.status).json(f.data);

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
                user_id,
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

const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Dummy API is running on http://localhost:${PORT}\nCommunication with NASS : ${process.env.AUTH_API_URL_DEV}\nLast update : 10:11 14/09/2025`);
});

