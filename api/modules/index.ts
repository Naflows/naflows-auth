import axios from "axios";
import { Request, Response } from "express";
import service from "../init";



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





async function manageConnection(req: Request, res: Response, route: string, data?: object | null, method: "POST" | "PUT" = "POST") {
    const { sessionID, token, uid } = getCookies(req);

    console.log(`Forwarding request to NASS at route: ${route} with data:`, data);

    await axios({
        method: method,
        url: `${process.env.AUTH_API_URL_DEV}${route}`,
        data: {
            user: {
                ip: req.ip,
                agent: req.headers['user-agent'],
                device_fingerprint: req.fingerprint,
                session_id: sessionID || null,
                token: token || null,
                user_id: uid || null,
            },
            ...data,
            request: {
                method: req.method,
                url: req.originalUrl,
                headers: req.headers,
                request_date: Date.now()
            },
            client: service
        }
    }).then((result) => {
        if (!result || !result.data) {
            console.error("No response data received from NASS but the request was successful.");
            return res.status(200).json({
                status: 200,
                success: true,
                message: "No response data received from NASS."
            });
        }

        const resultData = (result.data ? result.data.data : {}) || {};

        console.log("Response from NASS:", resultData);

        if (resultData.middleware) {
            sendCookies(res, result.data);
            delete resultData.middleware;
        }

        console.log(`Final response data sent to client for route ${route}:`, resultData , "with status:", result.status);
        res.status(result.status || 200).json(resultData);

    }).catch((error) => {
        const errorCode = error.response ? error.response.status : 500;
        if (errorCode === 409) {
            console.log("Handling 409 Conflict error for service token renewal.");
            console.log("Error response data:", error.response.data);
            const token = error.response.data.data.serviceToken;
            service.service_token = token.token;
            service.service_token_birth = token.created_at;
            console.log(`New service token set: ${service.service_token} (born at ${service.service_token_birth})`);
        }
        const errorData = error.response ? error.response.data : { success: false, message: "Unknown error occurred." };
        console.log("Error response data:", errorData);

        if (errorData.data && errorData.data.middleware) {
            sendCookies(res, errorData);
            delete errorData.data.middleware;
        }

        res.status(errorData.status).json(errorData);



    });
}

export { manageConnection, getCookies, sendCookies };