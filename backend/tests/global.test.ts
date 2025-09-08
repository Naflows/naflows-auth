import UCRType from "../types/.types/ucr.type";
const { test, expect, describe } = require('@jest/globals');

// Ensure setTimeout is available (for Node.js environments)
const setTimeoutPromise = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const app = process.env.AUTH_API_URL;

if (!app) {
    throw new Error("AUTH_API_URL is not set. Please set it in your environment variables.");
}


const dummy1 = {
    ip: "1.1.1.2",
    agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    device_fingerprint: "fingerprint-1",
    user_origin: "NASS",
    session_id: "1",
    token: "1",
    identifier: "dummy",
    password: "dummy",
    user_id: "2"
};

const dummy2 = {
    ip: "1.1.1.3",
    agent: dummy1.agent,
    device_fingerprint: "fingerprint-2",
    user_origin: "NASS",
    session_id: "2",
    token: "2",
    identifier: "dummy1",
    password: "dummy1",
    user_id: "3"
};

const dummy1_2 = {
    ip: "5.5.5.5",
    agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    device_fingerprint: "fingerprint-3",
    user_origin: "NASS",
    session_id: "3",
    token: "3",
    identifier: "dummy",
    password: "dummy",
    user_id: "2"
}



const getValidUCR = (userOverride = {}) => ({
    user: {
        ...dummy1,
        ...userOverride
    },
    client: {
        ip: "127.0.0.1",
        dns: "local.nass.com",
        service: "1",
        service_token: "test-service-token",
        service_token_birth: 1750658147765
    },
    request: {
        method: "POST",
        url: "/test",
        headers: { "Content-Type": "application/json" },
        body: { key: "value" },
        query: { param: "value" },
        request_date: 1700000000
    },
    data: {}
});

async function post(ucr, link = app) {
    const res = await fetch(link, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ucr)
    });
    const data = await res.json();
    return { status: res.status, data };
}

let newSessionID = "1";
let newTokenValue = "test-token-value";


describe("NASS SCV Tests", () => {

    test("UCR is valid (token only)", async () => {
        const ucr = getValidUCR({ identifier: undefined, password: undefined, session_id: newSessionID });
        ucr.data["customRequestURL"] = "/test/token-only";
        const res = await post(ucr);
        expect(res.status).toBe(200);
        expect(res.data).toEqual({
            success: true,
            status: 200,
            message: "Successful connection",
            data: {
                session: expect.any(String),
                token: expect.any(String),
                retry_after: expect.any(Number)
            }
        });
        newSessionID = res.data.data.session; // Store the new session ID for further tests
        newTokenValue = res.data.data.token; // Store the new token value for further tests
    });

    test("UCR is valid (identifier + password)", async () => {
        const ucr = getValidUCR({ token: undefined, session_id: newSessionID });
        ucr.data["customRequestURL"] = "/test/identifier-password";
        const res = await post(ucr);
        expect(res.status).toBe(200);
        expect(res.data).toEqual({
            success: true,
            status: 200,
            message: "Successful connection",
            data: {
                session: expect.any(String), // Expecting a session ID to be returned
                token: expect.any(String),
                retry_after: expect.any(Number)
            }
        });
        newSessionID = res.data.data.session; // Update the session ID for further tests
        newTokenValue = res.data.data.token; // Update the token value for further tests
    });

    test("UCR is invalid (token + identifier + password)", async () => {
        const ucr = getValidUCR({
            token: "invalid-token",
            identifier: "dummy",
            password: "dummy"
        });
        ucr.data["customRequestURL"] = "/test/invalid-token-with-identifier-password";
        const res = await post(ucr);
        expect(res.status).toBe(400);
        expect(res.data).toEqual({
            success: false,
            status: 400,
            message: "Invalid request format."
        });
    });

    test("UCR is invalid (missing fingerprint)", async () => {
        const ucr = getValidUCR({ device_fingerprint: undefined });
        const res = await post(ucr);
        ucr.data["customRequestURL"] = "/test/missing-fingerprint";
        expect(res.status).toBe(400);
        expect(res.data).toEqual({
            success: false,
            status: 400,
            message: "Invalid request format."
        });
    });

    test("Service invalid (wrong client IP)", async () => {
        const ucr = getValidUCR();
        ucr.client.ip = "123.123.123.123";
        delete ucr.user.token;
        ucr.data["customRequestURL"] = "/test/wrong-client-ip";
        const res = await post(ucr);
        expect(res.status).toBe(403);
        expect(res.data).toEqual({
            success: false,
            status: 403,
            message: "Unauthorized service access."
        });
    });

    test("Service invalid (expired token birth date)", async () => {
        const ucr = getValidUCR();
        ucr.client.service_token_birth = 156321;
        delete ucr.user.token;
        ucr.data["customRequestURL"] = "/test/expired-token-birth-date";
        const res = await post(ucr);
        expect(res.status).toBe(403);
        expect(res.data).toEqual({
            success: false,
            status: 403,
            message: "Invalid service token."
        });
    });

    test("Service invalid (wrong token)", async () => {
        const ucr = getValidUCR();
        delete ucr.user.token;
        ucr.client.service_token = "invalid-token";
        ucr.data["customRequestURL"] = "/test/wrong-token";
        const res = await post(ucr);
        expect(res.status).toBe(403);
        expect(res.data).toEqual({
            success: false,
            status: 403,
            message: "Invalid service token."
        });
    });

    test("Service invalid (inactive service)", async () => {
        const ucr = getValidUCR();
        delete ucr.user.token;

        ucr.client.service = "3";
        ucr.client.service_token = "test-service-token-inactive";
        ucr.client.service_token_birth = 1749676800;
        ucr.data["customRequestURL"] = "/test/inactive-service";
        const res = await post(ucr);
        expect(res.status).toBe(403);
        expect(res.data).toEqual({
            success: false,
            status: 403,
            message: "Unauthorized service access."
        });
    });

    test("Service token expired", async () => {
        const ucr = getValidUCR();
        delete ucr.user.token;
        ucr.client.service = "2";
        ucr.client.service_token = "test-service-token-expired";
        ucr.client.service_token_birth = 1749962909;
        ucr.data["customRequestURL"] = "/test/expired-token";

        const res = await post(ucr);
        expect(res.status).toBe(409);
        expect(res.data).toEqual({
            success: false,
            status: 409,
            message: "Conflict between service's token and NASS. Forcing reload. This might take a few seconds."
        });
    });

    test("Rate limit exceeded (too many requests)", async () => {
        const rates = process.env.BLACKLIST_RATES ? parseInt(process.env.BLACKLIST_RATES) : 100;
        const ucr = getValidUCR({ ip: "135.215.3.111", session_id: newSessionID });
        ucr.data["customRequestURL"] = "/test/too-many-requests";
        delete ucr.user.token;

        let caught = false;

        for (let i = 0; i < rates * 2; i++) {
            const res = await post(ucr);
            if (res.status === 429) {
                expect(res.data).toEqual({
                    success: false,
                    status: 429,
                    message: "Rate limit exceeded. Too many requests."
                });
                caught = true;
                break;
            }
        }

        expect(caught).toBe(true);
    });

});


describe("NASS SSV Tests", () => {
    const validUCR = getValidUCR();

    describe("User session is valid", () => {
        test("password + identifier", async () => {
            const ucr = { ...validUCR, user: { ...dummy1, session_id: newSessionID } };
            delete ucr.user.token;
            ucr.data["customRequestURL"] = "/test-ssv/user-session-valid/password-identifier";
            const res = await post(ucr);
            expect(res.status).toBe(200);
            expect(res.data).toEqual({
                success: true,
                status: 200,
                message: "Successful connection",
                data: {
                    session: expect.any(String),
                    token: expect.any(String),
                    retry_after: expect.any(Number)
                }
            });
            newSessionID = res.data.data.session; // Update the session ID for further tests
            newTokenValue = res.data.data.token; // Update the token value for further tests
        });


        test("token", async () => {
            const ucr = { ...validUCR, user: { ...dummy1, session_id: newSessionID, token: newTokenValue } };
            delete ucr.user.password;
            delete ucr.user.identifier;
            ucr.data["customRequestURL"] = "/test-ssv/user-session-valid/token";
            const res = await post(ucr);
            expect(res.status).toBe(200);
            expect(res.data).toEqual({
                success: true,
                status: 200,
                message: "Successful connection",
                data: {
                    session: expect.any(String),
                    token: expect.any(String),
                    retry_after: expect.any(Number)
                }
            });
            newSessionID = res.data.data.session;
            newTokenValue = res.data.data.token; // Update the token value for further tests
        });
    });

    describe("User data is invalid", () => {
        test("user id does not exist", async () => {
            const ucr = { ...validUCR, user: { ...dummy1, user_id: "9999", session_id: newSessionID } };
            delete ucr.user.token;
            ucr.data["customRequestURL"] = "/test-ssv/user-data-invalid/user-id";
            const res = await post(ucr);
            expect(res.status).toBe(401);
            expect(res.data).toEqual({
                success: false,
                status: 401,
                message: "Unknown user credentials.",
            });
        });

        test("token is invalid", async () => {
            const ucr = { ...validUCR, user: { ...dummy1, token: "invalid-token", session_id: newSessionID } };
            ucr.data["customRequestURL"] = "/test-ssv/user-data-invalid/token";
            delete ucr.user.password;
            delete ucr.user.identifier;
            const res = await post(ucr);
            expect(res.status).toBe(401);
            expect(res.data).toEqual({
                success: false,
                status: 401,
                message: "Invalid user credentials.",
            });
        });

        test("password is invalid", async () => {
            const ucr = { ...validUCR, user: { ...dummy1, password: "invalid-password", session_id: newSessionID } };
            delete ucr.user.token;
            ucr.data["customRequestURL"] = "/test-ssv/user-data-invalid/password";
            const res = await post(ucr);
            expect(res.status).toBe(401);
            expect(res.data).toEqual({
                success: false,
                status: 401,
                message: "Invalid user credentials.",
            });
        });

        test("identifier is invalid", async () => {
            const ucr = { ...validUCR, user: { ...dummy1, identifier: "invalid-identifier", session_id: newSessionID } };
            delete ucr.user.token;
            ucr.data["customRequestURL"] = "/test-ssv/user-data-invalid/identifier";
            const res = await post(ucr);
            expect(res.status).toBe(401);
            expect(res.data).toEqual({
                success: false,
                status: 401,
                message: "Invalid user credentials.",
            });
        });

        test("unknown session", async () => {
            const ucr = { ...validUCR, user: { ...dummy1, session_id: "50" } };
            delete ucr.user.token;
            ucr.data["customRequestURL"] = "/test-ssv/user-data-invalid/unknown-session";
            const res = await post(ucr);
            expect(res.status).toBe(401);
            expect(res.data).toEqual({
                success: false,
                status: 401,
                message: "Session not found.",
            });
        });
    });

    describe("Session data is missing or wrong", () => {
        test("missing / invalid device fingerprint", async () => {
            const ucr = { ...validUCR, user: { ...dummy1, device_fingerprint: "wrong-device-fingerprint", session_id: newSessionID } };
            delete ucr.user.token;
            ucr.data["customRequestURL"] = "/test-ssv/session-data-invalid/device-fingerprint";
            const res = await post(ucr);
            expect(res.status).toBe(401);
            expect(res.data).toEqual({
                success: false,
                status: 401,
                message: "Invalid session informations.",
            });
        });

        test("missing / invalid user origin", async () => {
            const ucr = { ...validUCR, user: { ...dummy1, user_origin: "wrong-user-origin", session_id: newSessionID } };
            delete ucr.user.token;
            ucr.data["customRequestURL"] = "/test-ssv/session-data-invalid/user-origin";
            const res = await post(ucr);
            expect(res.status).toBe(401);
            expect(res.data).toEqual({
                success: false,
                status: 401,
                message: "Invalid session informations.",
            });
        });

        test("missing / invalid user agent", async () => {
            const ucr = { ...validUCR, user: { ...dummy1, agent: "wrong-user-agent", session_id: newSessionID } };
            delete ucr.user.token;
            ucr.data["customRequestURL"] = "/test-ssv/session-data-invalid/user-agent";
            const res = await post(ucr);
            expect(res.status).toBe(401);
            expect(res.data).toEqual({
                success: false,
                status: 401,
                message: "Invalid session informations.",
            });
        });

        test("missing / invalid user IP", async () => {
            const ucr = { ...validUCR, user: { ...dummy1, ip: "195.135.264.123", session_id: newSessionID } };
            delete ucr.user.token;
            ucr.data["customRequestURL"] = "/test-ssv/session-data-invalid/user-ip";
            const res = await post(ucr);
            expect(res.status).toBe(401);
            expect(res.data).toEqual({
                success: false,
                status: 401,
                message: "Invalid session informations.",
            });
        });

        test("pointing to a wrong session id", async () => {
            const ucr = { ...validUCR, user: { ...dummy1, session_id: "2" } };
            delete ucr.user.token;

            ucr.data["customRequestURL"] = "/test-ssv/session-data-invalid/session-id";
            const res = await post(ucr);
            expect(res.status).toBe(401);
            expect(res.data).toEqual({
                success: false,
                status: 401,
                message: "Invalid session informations.",
            });
        });
    });

    describe("Session is outdated", () => {
        let renewalTokenId;
        let sessionId;
        let renewTokenValue;

        test("session is outdated", async () => {
            const ucr = { ...validUCR, user: { ...dummy2 } };
            delete ucr.user.token;
            ucr.data["customRequestURL"] = "/test-ssv/session-outdated";
            const res = await post(ucr);
            expect(res.status).toBe(401);
            expect(res.data).toEqual({
                success: false,
                status: 401,
                message: "Session is outdated.",
                data: {
                    token: expect.any(String)
                }
            });
            renewalTokenId = res.data.data.token; // Store the token ID for further tests
        });



        test("renew session with invalid token", async () => {
            const ucr = {
                ...validUCR, user: { ...dummy2 }, data: {
                    "session-renewal-token": "wrong-renewal-token"
                }
            };
            delete ucr.user.token;
            ucr.data["customRequestURL"] = "/test-ssv/session-renewal/invalid-token";
            const res = await post(ucr);
            expect(res.status).toBe(401);
            expect(res.data).toEqual({
                success: false,
                status: 401,
                message: "Session is outdated.",
                data: {
                    token: expect.any(String)
                }
            });
            renewalTokenId = res.data.data.token; // Update the token ID for further tests
        });


        test("renew session with valid token but invalid identifier", async () => {
            const ucr = {
                ...validUCR, user: { ...dummy2, identifier: "wrong-identifier" }, data: {
                    "session-renewal-token": renewalTokenId
                }
            };
            delete ucr.user.token;
            ucr.data["customRequestURL"] = "/test-ssv/session-renewal/invalid-identifier";
            const res = await post(ucr);
            expect(res.status).toBe(401);
            expect(res.data).toEqual({
                success: false,
                status: 401,
                message: "Invalid credentials provided."
            });
        });

        test("renew session with valid token but invalid password", async () => {
            const ucr = {
                ...validUCR, user: { ...dummy2, password: "wrong-password" }, data: {
                    "session-renewal-token": renewalTokenId
                }
            };
            delete ucr.user.token;
            ucr.data["customRequestURL"] = "/test-ssv/session-renewal/invalid-password";
            const res = await post(ucr);
            expect(res.status).toBe(401);
            expect(res.data).toEqual({
                success: false,
                status: 401,
                message: "Invalid credentials provided."
            });

        });


        test("renew session with valid token", async () => {
            const ucr = {
                ...validUCR, user: { ...dummy2, session_id: "2" }, data: {
                    "session-renewal-token": renewalTokenId
                }
            };
            delete ucr.user.token;
            ucr.data["customRequestURL"] = "/test-ssv/session-renewal/valid-token";
            const res = await post(ucr);
            expect(res.status).toBe(200);
            expect(res.data).toEqual({
                success: true,
                status: 200,
                message: "Successful connection",
                data: {
                    token: expect.any(String),
                    session: expect.any(String),
                    retry_after: expect.any(Number)
                }
            });
            sessionId = res.data.data.session; // Store the session ID for further tests
            renewTokenValue = res.data.data.token; // Store the new token value for further tests

        });

        test('try to renew session with the old token', async () => {
            const ucr = { ...validUCR, user: { ...dummy2, session_id: sessionId } };
            delete ucr.user.password;
            delete ucr.user.identifier;
            ucr.data["customRequestURL"] = "/test-ssv/session-connection-after-renewal/old-token";
            const res = await post(ucr);
            expect(res.status).toBe(401);
            expect(res.data).toEqual({
                success: false,
                status: 401,
                message: "Invalid user credentials."
            });
        });


        test("try to renew session after renewal", async () => {
            const ucr = { ...validUCR, user: { ...dummy2, session_id: sessionId, token: renewTokenValue } };
            delete ucr.user.password;
            delete ucr.user.identifier;
            ucr.data["customRequestURL"] = "/test-ssv/session-connection-after-renewal/valid-token";
            const res = await post(ucr);
            expect(res.status).toBe(200);
            expect(res.data).toEqual({
                success: true,
                status: 200,
                message: "Successful connection",
                data: {
                    session: expect.any(String),
                    token: expect.any(String),
                    retry_after: expect.any(Number)
                }
            });
            sessionId = res.data.data.session; // Update the session ID for further tests
            renewTokenValue = res.data.data.token; // Update the token value for further tests
        });


        test("session is not outdated anymore", async () => {
            const ucr = { ...validUCR, user: { ...dummy2, session_id: sessionId, token: renewTokenValue } };
            delete ucr.user.password;
            delete ucr.user.identifier;
            ucr.data["customRequestURL"] = "/test-ssv/session-not-outdated";
            const res = await post(ucr);
            expect(res.status).toBe(200);
            expect(res.data).toEqual({
                success: true,
                status: 200,
                message: "Successful connection",
                data: {
                    session: expect.any(String),
                    token: expect.any(String),
                    retry_after: expect.any(Number)
                }
            });
        });
    });
})



describe("NASS STV Tests", () => {
    let timingBeforeUnfrozen;
    let tokenRenewalValue;

    test("token is expired", async () => {
        const ucr = getValidUCR({ ...dummy1_2 });
        ucr.data["customRequestURL"] = "/test-stv/token-expired";
        delete ucr.user.password;
        delete ucr.user.identifier;
        const res = await post(ucr);
        expect(res.status).toBe(401);
        expect(res.data).toEqual({
            success: false,
            status: 401,
            message: "Token is expired or has reached its maximum uses. Please log in again.",
            data: {
                token: expect.any(String),
                session: expect.any(String)
            }
        });
        tokenRenewalValue = res.data.data.token;
        newSessionID = res.data.data.session;
    })

    test('renew token with wrong token renewal', async () => {
        const ucr = {
            ...getValidUCR({ ...dummy1_2, session_id: newSessionID }),
            data: {
                "renewal-token": "invalid-renewal-token"
            }
        };
        ucr.data["customRequestURL"] = "/test-stv/renew-token-invalid";
        delete ucr.user.token;
        const res = await post(ucr);
        expect(res.status).toBe(401);
        expect(res.data).toEqual({
            success: false,
            status: 401,
            message: "Renewal token is invalid or not provided.",
            data: {
                session: expect.any(String)
            }
        });
        newSessionID = res.data.data.session; // Update the session ID for further tests
    });

    test('renew token with invalid credentials', async () => {
        const ucr = {
            ...getValidUCR({ ...dummy1_2, session_id: newSessionID }),
            data: {
                "renewal-token": tokenRenewalValue
            }
        };
        ucr.data["customRequestURL"] = "/test-stv/renew-token-invalid-credentials";
        delete ucr.user.token;
        ucr.user.identifier = "invalid-identifier";
        const res = await post(ucr);
        expect(res.status).toBe(401);
        expect(res.data).toEqual({
            success: false,
            status: 401,
            message: "Invalid user credentials."
        });
    });


    test('renew token with valid credentials', async () => {
        const ucr = {
            ...getValidUCR({ ...dummy1_2, session_id: newSessionID }),
            data: {
                "renewal-token": tokenRenewalValue
            }
        };
        ucr.data["customRequestURL"] = "/test-stv/renew-token-valid";
        delete ucr.user.token;
        const res = await post(ucr);
        expect(res.status).toBe(200);
        expect(res.data).toEqual({
            success: true,
            status: 200,
            message: "Successful connection",
            data: {
                token: expect.any(String),
                session: expect.any(String)
            }
        });
        newSessionID = res.data.data.session; // Update the session ID for further tests
        newTokenValue = res.data.data.token; // Update the token value for further tests
    });


    test("token is not frozen", async () => {
        const ucr = getValidUCR({ ...dummy1_2, token: newTokenValue, session_id: newSessionID });
        ucr.data["customRequestURL"] = "/test-stv/token-not-frozen";
        delete ucr.user.password;
        delete ucr.user.identifier;
        const res = await post(ucr);
        expect(res.status).toBe(200);
        expect(res.data).toEqual({
            success: true,
            status: 200,
            message: "Successful connection",
            data: {
                token: expect.any(String), 
                session: expect.any(String),
                retry_after: expect.any(Number)
            }
        });
        newSessionID = res.data.data.session; // Update the session ID for further tests
        newTokenValue = res.data.data.token; // Update the token value for further tests
    });

    test("token is frozen", async () => {
        const ucr = getValidUCR({ ...dummy1_2, token: newTokenValue, session_id: newSessionID });
        ucr.data["customRequestURL"] = "/test-stv/token-frozen";
        delete ucr.user.password;
        delete ucr.user.identifier;
        const res = await post(ucr);
        expect(res.status).toBe(429);
        expect(res.data).toEqual({
            success: false,
            status: 429,
            message: "Token is frozen.",
            data: {
                session: expect.any(String), // Expecting a session ID to be returned
                retry_after: expect.any(Number) // Expecting a retry_after value
            }
        });
        newSessionID = res.data.data.session; // Update the session ID for further tests
        timingBeforeUnfrozen = res.data.data.retry_after; // Store the retry_after value for further tests
    });

    test("token is frozen, but unfrozen after a delay", async () => {
        const ucr = getValidUCR({ ...dummy1_2, token: newTokenValue, session_id: newSessionID });
        ucr.data["customRequestURL"] = "/test-stv/token-frozen-unfrozen";
        delete ucr.user.password;
        delete ucr.user.identifier;

        // Wait for the token to be unfrozen
        await setTimeoutPromise(timingBeforeUnfrozen + 1000); // Adding 1 second buffer

        const res = await post(ucr);
        expect(res.status).toBe(200);
        expect(res.data).toEqual({
            success: true,
            status: 200,
            message: "Successful connection",
            data: {
                token: expect.any(String),
                session: expect.any(String),
                retry_after: expect.any(Number)
            }
        });
        newSessionID = res.data.data.session;
        newTokenValue = res.data.data.token;
        timingBeforeUnfrozen = res.data.data.retry_after;
    });

    test("trying to access a non-existing route", async () => {
        const ucr = getValidUCR({ ...dummy1_2, token: newTokenValue, session_id: newSessionID });
        ucr.data["customRequestURL"] = "/test-stv/non-existing-route";
        ucr.request.url = "/what/is/this/route";
        delete ucr.user.password;
        delete ucr.user.identifier;

        await setTimeoutPromise(1000 + timingBeforeUnfrozen);

        const res = await post(ucr);
        expect(res.status).toBe(404);
        expect(res.data).toEqual({
            success: false,
            status: 404,
            message: "Route not found.",
            data: {
                session: expect.any(String),
            }
        });
        newSessionID = res.data.data.session; 
    });

    test('accessing an existing route with wrong token rights', async () => {
        const ucr = getValidUCR({ ...dummy1_2, token: newTokenValue, session_id: newSessionID });
        ucr.data["customRequestURL"] = "/test-stv/existing-route-wrong-token-rights";
        ucr.request.url = "/secure/check";
        delete ucr.user.password;
        delete ucr.user.identifier;

        const res = await post(ucr);
        expect(res.status).toBe(403);
        expect(res.data).toEqual({
            success: false,
            status: 403,
            message: "Insufficient rights to access this route.",
            data: {
                session: expect.any(String),
            }
        });
        newSessionID = res.data.data.session; 
    });

    test('accessing an existing route with wrong user rights & token', async () => {
        const ucr = getValidUCR({ ...dummy1_2, token: newTokenValue, session_id: newSessionID });
        ucr.data["customRequestURL"] = "/test-stv/existing-route-wrong-user-rights/token";
        ucr.request.url = "/test/user";
        delete ucr.user.password;
        delete ucr.user.identifier;

        const res = await post(ucr);
        expect(res.status).toBe(403);
        expect(res.data).toEqual({
            success: false,
            status: 403,
            message: "Insufficient rights to access this route.",
            data: {
                session: expect.any(String),
            }
        });
        newSessionID = res.data.data.session; 
    })

    test('accessing an existing route with wrong user rights & identifier/password', async () => {
        const ucr = getValidUCR({ ...dummy1_2, session_id: newSessionID });
        ucr.data["customRequestURL"] = "/test-stv/existing-route-wrong-user-rights/identifier-password";
        ucr.request.url = "/test/user";
        delete ucr.user.token;

        const res = await post(ucr);
        expect(res.status).toBe(403);
        expect(res.data).toEqual({
            success: false,
            status: 403,
            message: "Insufficient rights to access this route.",
            data: {
                session: expect.any(String),
            }
        });
        newSessionID = res.data.data.session; 
    })

    

    
    test('accessing an existing route with correct rights & token', async () => {
        const ucr = getValidUCR({ ...dummy1_2, token: newTokenValue, session_id: newSessionID });
        ucr.data["customRequestURL"] = "/test-stv/existing-route-correct-rights/token";
        ucr.request.url = "/token/build/user";
        delete ucr.user.password;
        delete ucr.user.identifier;


        const res = await post(ucr);
        expect(res.status).toBe(200);
        expect(res.data).toEqual({
            success: true,
            status: 200,
            message: "Successful connection",
            data: {
                session: expect.any(String),
                token: expect.any(String),
                retry_after: expect.any(Number)
            }
        });
        newSessionID = res.data.data.session; 
        newTokenValue = res.data.data.token; 
        timingBeforeUnfrozen = res.data.data.retry_after; 

    })

    test('accessing an existing route with correct rights & identifier/password', async () => {
        const ucr = getValidUCR({ ...dummy1_2, session_id: newSessionID });
        ucr.data["customRequestURL"] = "/test-stv/existing-route-correct-rights-identifier-password";
        ucr.request.url = "/token/build/user";
        delete ucr.user.token;
        await setTimeoutPromise(1000 + timingBeforeUnfrozen);

        const res = await post(ucr);
        expect(res.status).toBe(200);
        expect(res.data).toEqual({
            success: true,
            status: 200,
            message: "Successful connection",
            data: {
                session: expect.any(String),
                token: expect.any(String),
                retry_after: expect.any(Number)
            }
        });
        newSessionID = res.data.data.session; 
        newTokenValue = res.data.data.token; 
        timingBeforeUnfrozen = res.data.data.retry_after; 
    });
});



async function postToLogin(userID, password, identifier) {
    const res = await fetch("http://auth-api-1:3000/client/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID, password, identifier })
    });
    return res;
}


describe("User Connection Tests", () => {
    test('User login failed (wrong password)', async () => {
        const res = await postToLogin("1", "wrong-password", "123456789");
        expect(res.status).toBe(401);
    })

    test('User login failed (wrong user id)', async () => {
        const res = await postToLogin("wrong-id", "W8JdVoy30xEa1hZ5aDVQ", "123456789");
        expect(res.status).toBe(401);
    })

    test('User login failed (wrong identifier)', async () => {
        const res = await postToLogin("1", "W8JdVoy30xEa1hZ5aDVQ", "wrong-identifier");
        expect(res.status).toBe(401);
    })

    test('User login successful', async () => {
        const res = await postToLogin("1", "W8JdVoy30xEa1hZ5aDVQ", "123456789");
        expect(res.status).toBe(200);
    })


})