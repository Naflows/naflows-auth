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
    origin: ['http://localhost:8080', 'https://nass.naflows.com', 'http://localhost:3005', "http://localhost"  // Add this
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
    service_token_birth: new Date("2025-09-26").getTime()
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
    const { sessionID, token, uid } = getCookies(req);
    const serviceID = req.body.serviceID;

    const f = await axios.post(`${process.env.AUTH_API_URL_DEV}/nass/user/instance/connect`, {
        user: {
            ip: req.ip,
            agent: req.headers['user-agent'],
            device_fingerprint: req.fingerprint,
            session_id: sessionID || null,
            token: token || null,
            user_id: uid || null,
        },
        serviceID: serviceID,
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





app.put('/user/secure/service/update', async (req: Request, res: Response) => {
    const { sessionID, token, uid } = getCookies(req);
    const serviceDetails = req.body.serviceDetails;

    const f = await axios.put(`${process.env.AUTH_API_URL_DEV}/client/secure/services/update`, {
        user: {
            ip: req.ip,
            agent: req.headers['user-agent'],
            device_fingerprint: req.fingerprint,
            session_id: sessionID || null,
            token: token || null,
            user_id: uid || null,
        },
        service: serviceDetails,
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

app.post('/user/secure/service/logs', async (req: Request, res: Response) => {
    const { sessionID, token, uid } = getCookies(req);

    const f = await axios.post(`${process.env.AUTH_API_URL_DEV}/client/secure/services/get-logs`, {
        user: {
            ip: req.ip,
            agent: req.headers['user-agent'],
            device_fingerprint: req.fingerprint,
            session_id: sessionID || null,
            token: token || null,
            user_id: uid || null,
        },
        service_id: req.body.service_id,
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

app.post('/user/secure/service/traffic', async (req: Request, res: Response) => {
    const { sessionID, token, uid } = getCookies(req);

    const f = await axios.post(`${process.env.AUTH_API_URL_DEV}/client/secure/services/get-traffic`, {
        user: {
            ip: req.ip,
            agent: req.headers['user-agent'],
            device_fingerprint: req.fingerprint,
            session_id: sessionID || null,
            token: token || null,
            user_id: uid || null,
        },
        service_id: req.body.service_id,
        offset: req.body.offset || 0,
        limit: req.body.limit || 50,
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

app.post('/user/secure/service/rights/create', async (req: Request, res: Response) => {
    const { sessionID, token, uid } = getCookies(req);

    await axios.post(`${process.env.AUTH_API_URL_DEV}/client/secure/services/rights/create`, {
        user: {
            ip: req.ip,
            agent: req.headers['user-agent'],
            device_fingerprint: req.fingerprint,
            session_id: sessionID || null,
            token: token || null,
            user_id: uid || null,
        },
        service_id: req.body.service_id,
        name: req.body.name,
        type: req.body.type,
        deletable: req.body.deletable,
        rights: req.body.rights,
        request: {
            method: req.method,
            url: req.originalUrl,
            headers: req.headers,
            request_date: Date.now()
        },
        client: service
    }).then((result) => {
        const resultData = result.data.data;

        if (result.status === 200) {
            console.log("Rights created successfully:", resultData);

            sendCookies(res, result.data);

            delete resultData.middleware;

            res.status(result.status).json(resultData);
        } else {
            console.error("Error creating rights:", resultData.message || "Unknown error");
            sendCookies(res, result.data);
            delete resultData.middleware;
            res.status(result.status).json(resultData);
        }
    }).catch((error) => {
        console.error("Error creating rights:", error.response ? error.response.data : error.message);
        sendCookies(res, error.response.data);
        const errorData = error.response ? error.response.data : { success: false, message: "Unknown error occurred." };
        delete errorData.data.middleware;
        res.status(error.response.status).json(errorData);
    });


});


app.post('/user/secure/service/key/get', async (req: Request, res: Response) => {
    const { sessionID, token, uid } = getCookies(req);

    await axios.post(`${process.env.AUTH_API_URL_DEV}/client/secure/services/service/key`, {
        user: {
            ip: req.ip,
            agent: req.headers['user-agent'],
            device_fingerprint: req.fingerprint,
            session_id: sessionID || null,
            token: token || null,
            user_id: uid || null,
        },
        service_id: req.body.service_id,
        request: {
            method: req.method,
            url: req.originalUrl,
            headers: req.headers,
            request_date: Date.now()
        },
        client: service
    }).then((result) => {
        const resultData = result.data.data;

        if (result.status === 200 || result.status === 201) {
            sendCookies(res, result.data);

            delete resultData.middleware;

            res.status(result.status).json(resultData);
        } else {
            sendCookies(res, result.data);
            delete resultData.middleware;
            res.status(result.status).json(resultData);
        }
    }).catch((error) => {
        sendCookies(res, error.response.data);
        const errorData = error.response ? error.response.data : { success: false, message: "Unknown error occurred." };
        delete errorData.data.middleware;
        res.status(error.response.status).json(errorData);
    });


});

app.post('/user/secure/service/rights/get', async (req: Request, res: Response) => {
    const { sessionID, token, uid } = getCookies(req);

    const f = await axios.post(`${process.env.AUTH_API_URL_DEV}/client/secure/services/rights/get`, {
        user: {
            ip: req.ip,
            agent: req.headers['user-agent'],
            device_fingerprint: req.fingerprint,
            session_id: sessionID || null,
            token: token || null,
            user_id: uid || null,
        },
        service_id: req.body.service_id,
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

app.post('/user/secure/service/register', async (req: Request, res: Response) => {
    const { sessionID, token, uid } = getCookies(req);
    const code = req.body.code;
    const serviceID = req.body.serviceID;

    const f = await axios.post(`${process.env.AUTH_API_URL_DEV}/client/secure/user/register-in-api`, {
        user: {
            ip: req.ip,
            agent: req.headers['user-agent'],
            device_fingerprint: req.fingerprint,
            session_id: sessionID || null,
            token: token || null,
            user_id: uid || null,
        },
        code: code,
        serviceID: serviceID,
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

app.post('/user/secure/services/can-access', async (req: Request, res: Response) => {
    const { sessionID, token, uid } = getCookies(req);

    await axios.post(`${process.env.AUTH_API_URL_DEV}/client/secure/services/user/check-access`, {
        user: {
            ip: req.ip,
            agent: req.headers['user-agent'],
            device_fingerprint: req.fingerprint,
            session_id: sessionID || null,
            token: token || null,
            user_id: uid || null,
        },
        service_id: req.body.service_id,
        request: {
            method: req.method,
            url: req.originalUrl,
            headers: req.headers,
            request_date: Date.now()
        },
        client: service
    }).then((result) => {
        const resultData = result.data.data;


        sendCookies(res, result.data);
        delete resultData.middleware;
        console.log(`--- User access check result for service ${req.body.service_id}:`, resultData);
        res.status(result.status).json(resultData);

    }).catch((error) => {
        sendCookies(res, error.response.data);
        const errorData = error.response ? error.response.data : { success: false, message: "Unknown error occurred." };
        delete errorData.data.middleware;
        res.status(error.response.status).json(errorData);
    });

});

app.post('/user/secure/confirm-identity/send-code', async (req: Request, res: Response) => {
    const { sessionID, token, uid } = getCookies(req);

    const f = await axios.post(`${process.env.AUTH_API_URL_DEV}/client/secure/user/send-verification-code`, {
        user: {
            ip: req.ip,
            agent: req.headers['user-agent'],
            device_fingerprint: req.fingerprint,
            session_id: sessionID || null,
            token: token || null,
            user_id: uid || null,
        },
        serviceID: req.body.serviceID,
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

app.post('/set-user-info/notifications/mark-as-read', async (req: Request, res: Response) => {
    const { sessionID, token, uid } = getCookies(req);
    const notificationId = req.body.notificationId;

    const f = await axios.post(`${process.env.AUTH_API_URL_DEV}/client/secure/user/notifications/mark-as-read`, {
        user: {
            ip: req.ip,
            agent: req.headers['user-agent'],
            device_fingerprint: req.fingerprint,
            session_id: sessionID || null,
            token: token || null,
            user_id: uid || null,
        },
        notificationId,
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

app.post('/get-user-info/notifications', async (req: Request, res: Response) => {
    const { sessionID, token, uid } = getCookies(req);

    const f = await axios.post(`${process.env.AUTH_API_URL_DEV}/client/secure/data/notifications`, {
        user: {
            ip: req.ip,
            agent: req.headers['user-agent'],
            device_fingerprint: req.fingerprint,
            session_id: sessionID || null,
            token: token || null,
            user_id: uid || null,
        },
        start: req.query.start || 0,
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

app.put('/set-user-info/user/update', async (req: Request, res: Response) => {
    const { sessionID, token, uid } = getCookies(req);
    const userDetails = req.body.userDetails;
    console.log("User update details received:", userDetails);

    const f = await axios.put(`${process.env.AUTH_API_URL_DEV}/client/secure/user/update`, {
        user: {
            ip: req.ip,
            agent: req.headers['user-agent'],
            device_fingerprint: req.fingerprint,
            session_id: sessionID || null,
            token: token || null,
            user_id: uid || null,
        },
        userDetails,
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


app.post('/client/logout', async (req: Request, res: Response) => {
    const { sessionID, token, uid } = getCookies(req);

    const f = await axios.post(`${process.env.AUTH_API_URL_DEV}/client/logout`, {
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

    res.status(f.status).json(f.data);
});


const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Dummy API is running on http://localhost:${PORT}\nCommunication with NASS : ${process.env.AUTH_API_URL_DEV}\nLast update : 15:53 25/09/2025`);
});

