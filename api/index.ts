import axios from 'axios';
import cors from 'cors';
require('dotenv').config();

const express = require('express');
const fingerprint = require('express-fingerprint');
const cookieParser = require('cookie-parser');
const router = express.Router();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:8080',// Dev
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


app.get('/get-user-info/services', async (req, res) => {
    const cookies = req.headers.cookie || '';

    const { sessionID, token, uid } = getCookies(req);

    const f = await axios.post(`${process.env.AUTH_API_URL_DEV}/client/secure/data/services`, {
        user: {
            ip: req.ip,
            agent: req.headers['user-agent'],
            fingerprint: req.fingerprint,
            user_origin: "naflows_backend",
            session_id: sessionID || null,
            token: token || null,
            user_id: uid || null,
        },
    });


    sendCookies(res, f.data);

    delete f.data.data.middleware;

    res.status(f.status).json(f.data);

});

app.get('/get-user-info/user', async (req, res) => {
    const cookies = req.headers.cookie || '';

    const { sessionID, token, uid } = getCookies(req);

    const f = await axios.post(`${process.env.AUTH_API_URL_DEV}/client/secure/data/user`, {
        user: {
            ip: req.ip,
            agent: req.headers['user-agent'],
            fingerprint: req.fingerprint,
            user_origin: "naflows_backend",
            session_id: sessionID || null,
            token: token || null,
            user_id: uid || null,
        },
    });


    sendCookies(res, f.data);

    delete f.data.data.middleware;

    res.status(f.status).json(f.data);

});

// THIS IS A PIPE USED LATER TO COMMUNICATE WITH NASS
// THIS PIPE IS TO BE USED BY ANY SERVICE THAT NEEDS TO AUTHENTICATE A USER
// IT WILL FORWARD THE REQUEST TO NASS AND RETURN THE RESPONSE
// IT WILL ALSO SET THE COOKIES RECEIVED FROM NASS

app.post('/send-login-request', async (req, res) => {
    const { user_id, password, identifier } = req.body;



    try {
        const f = await axios.post(`${process.env.AUTH_API_URL_DEV}/client/login`, {
            user: {
                user_id,
                password,
                identifier,
                user_ip: req.ip,
                agent: req.headers['user-agent'],
                fingerprint: req.fingerprint
            },
            service: {
                ip: "dummy-api", // TODO : Get real IP
                service: "naflows_backend",
                service_token: "naflows_backend_token",
                service_token_birth: new Date("2025-09-01").getTime()
            }
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
    console.log(`Dummy API is running on http://localhost:${PORT}\nCommunication with NASS : ${process.env.AUTH_API_URL_DEV}\nLast update : 15:38 09/09/2025`);
});

