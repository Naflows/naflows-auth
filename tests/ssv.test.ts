
/*

    Things to test: 
    * Identifier
    * Password
    * Token (ONLY TEST TOKEN VALUE, STV COMES LATER)
    * Session creation

*/

import { fail } from "assert";
import UCRType from "../types/.types/ucr.type";

const { test, expect, describe } = require('@jest/globals');
const axios = require('axios');


const app = "http://localhost:3000/test";

const dummy1 = {
    ip : "1.1.1.2",
    agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    device_fingerprint: "fingerprint-1",
    user_origin : "NASS",
    session_id : 1,
    token : "test-token",
    identifier : "dummy",
    password : "dummy",
    user_id : 2
}

const dummy2 = {
    identifier : "dummy1",
    password : "dummy1",
    token : "test-token-2",
    session_id : 2,
    user_origin : "NASS",
    ip : "1.1.1.3",
    agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    device_fingerprint: "fingerprint-2",
    user_id : 3
}

let validUCR: UCRType = {
  user: {
    ip: "192.168.1.111",
    agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    session_id: -1,
    token: "token",
    device_fingerprint: "fingerprint",
    user_origin: "/test/",
    user_id : 1
  },
  client: {
    ip: "127.0.0.1",
    dns: "local.nass.com",
    service: "Test Service : token is not expired",
    service_token: "test-service-token",
    service_token_birth: 1750049309
  },
  request: {
    method: "POST",
    url: "/test-ssv",
    headers: {
      "Content-Type": "application/json"
    },
    body: { key: "value" },
    query: { param: "value" },
    request_date: 1700000000,
  }
};


async function post(ucr: any) {
  const response = await fetch(app, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ucr)
  });
  const data = await response.json(); 
  return { status: response.status, data };
}

describe("User session is valid", () => {
  test("password + identifier", async () => {
    const ucr = { ...validUCR, user: { ...dummy1 } };
    delete ucr.user.token;
    ucr.request.url = "/test-ssv/user-session-valid/password-identifier";
    const res = await post(ucr);
    expect(res.status).toBe(200);
    expect(res.data).toEqual({
      success: true,
      status: 200,
      message: "Successful connection",
    });
  });

  test("token", async () => {
    const ucr = { ...validUCR, user: { ...dummy1 } };
    delete ucr.user.password;
    delete ucr.user.identifier;
    ucr.user.token = dummy1.token;
    ucr.request.url = "/test-ssv/user-session-valid/token";
    const res = await post(ucr);
    expect(res.status).toBe(200);
    expect(res.data).toEqual({
      success: true,
      status: 200,
      message: "Successful connection",
    });
  });
});

describe("User data is invalid", () => {
  test("user id does not exist", async () => {
    const ucr = { ...validUCR, user: { ...dummy1, user_id: 9999 } };
    delete ucr.user.token;
    ucr.request.url = "/test-ssv/user-data-invalid/user-id";
    const res = await post(ucr);
    expect(res.status).toBe(401);
    expect(res.data).toEqual({
      success: false,
      status: 401,
      message: "Unknown user credentials.",
    });
  });

  test("token is invalid", async () => {
    const ucr = { ...validUCR, user: { ...dummy1, token: "invalid-token" } };
    ucr.request.url = "/test-ssv/user-data-invalid/token";
    const res = await post(ucr);
    expect(res.status).toBe(401);
    expect(res.data).toEqual({
      success: false,
      status: 401,
      message: "Invalid user credentials.",
    });
  });

  test("password is invalid", async () => {
    const ucr = { ...validUCR, user: { ...dummy1, password: "invalid-password" } };
    delete ucr.user.token;
    ucr.request.url = "/test-ssv/user-data-invalid/password";
    const res = await post(ucr);
    expect(res.status).toBe(401);
    expect(res.data).toEqual({
      success: false,
      status: 401,
      message: "Invalid user credentials.",
    });
  });

  test("identifier is invalid", async () => {
    const ucr = { ...validUCR, user: { ...dummy1, identifier: "invalid-identifier" } };
    delete ucr.user.token;
    ucr.request.url = "/test-ssv/user-data-invalid/identifier";
    const res = await post(ucr);
    expect(res.status).toBe(401);
    expect(res.data).toEqual({
      success: false,
      status: 401,
      message: "Invalid user credentials.",
    });
  });

  test("unknown session", async () => {
    const ucr = { ...validUCR, user: { ...dummy1, session_id: 50 } };
    delete ucr.user.token;
    ucr.request.url = "/test-ssv/user-data-invalid/unknown-session";
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
    const ucr = { ...validUCR, user: { ...dummy1, device_fingerprint: "wrong-device-fingerprint" } };
    delete ucr.user.token;
    ucr.request.url = "/test-ssv/session-data-invalid/device-fingerprint";
    const res = await post(ucr);
    expect(res.status).toBe(401);
    expect(res.data).toEqual({
      success: false,
      status: 401,
      message: "Invalid session informations.",
    });
  });

  test("missing / invalid user origin", async () => {
    const ucr = { ...validUCR, user: { ...dummy1, user_origin: "wrong-user-origin" } };
    delete ucr.user.token;
    ucr.request.url = "/test-ssv/session-data-invalid/user-origin";
    const res = await post(ucr);
    expect(res.status).toBe(401);
    expect(res.data).toEqual({
      success: false,
      status: 401,
      message: "Invalid session informations.",
    });
  });

  test("missing / invalid user agent", async () => {
    const ucr = { ...validUCR, user: { ...dummy1, agent: "wrong-user-agent" } };
    delete ucr.user.token;
    ucr.request.url = "/test-ssv/session-data-invalid/user-agent";
    const res = await post(ucr);
    expect(res.status).toBe(401);
    expect(res.data).toEqual({
      success: false,
      status: 401,
      message: "Invalid session informations.",
    });
  });

  test("missing / invalid user IP", async () => {
    const ucr = { ...validUCR, user: { ...dummy1, ip: "195.135.264.123" } };
    delete ucr.user.token;
    ucr.request.url = "/test-ssv/session-data-invalid/user-ip";
    const res = await post(ucr);
    expect(res.status).toBe(401);
    expect(res.data).toEqual({
      success: false,
      status: 401,
      message: "Invalid session informations.",
    });
  });

  test("pointing to a wrong session id", async () => {
    const ucr = { ...validUCR, user: { ...dummy1, session_id: 2 } };
    delete ucr.user.token;
    
    ucr.request.url = "/test-ssv/session-data-invalid/session-id";
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

  test("session is outdated", async () => {
    const ucr = { ...validUCR, user: { ...dummy2 } };
    delete ucr.user.token;
    ucr.request.url = "/test-ssv/session-outdated";
    const res = await post(ucr);
    expect(res.status).toBe(401);
    expect(res.data).toEqual({
      success: false,
      status: 401,
      message: "Session is outdated.",
      data : {
        token : expect.any(String)
      }
    });
    renewalTokenId = res.data.data.token; // Store the token ID for further tests
  });

  

  test("renew session with invalid token", async () => {
    const ucr = { ...validUCR, user: { ...dummy2 }, data: {
      "session-renewal-token": "wrong-renewal-token"
    } };
    delete ucr.user.token;
    ucr.request.url = "/test-ssv/session-renewal/invalid-token";
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
    const ucr = { ...validUCR, user: { ...dummy2, identifier : "wrong-identifier" }, data: {
      "session-renewal-token": renewalTokenId
    } };
    delete ucr.user.token;
    ucr.request.url = "/test-ssv/session-renewal";
    const res = await post(ucr);
    expect(res.status).toBe(401);
    expect(res.data).toEqual({
      success: false,
      status: 401,
      message: "Invalid credentials provided."
    });
  });

  test("renew session with valid token but invalid password", async () => {
    const ucr = { ...validUCR, user: { ...dummy2, password : "wrong-password" }, data: {
      "session-renewal-token": renewalTokenId
    } };
    delete ucr.user.token;
    ucr.request.url = "/test-ssv/session-renewal";
    const res = await post(ucr);
    expect(res.status).toBe(401);
    expect(res.data).toEqual({
      success: false,
      status: 401,
      message: "Invalid credentials provided."
    });
  });


  test("renew session with valid token", async () => {
    const ucr = { ...validUCR, user: { ...dummy2 }, data: {
      "session-renewal-token": renewalTokenId
    } };
    delete ucr.user.token;
    ucr.request.url = "/test-ssv/session-renewal";
    const res = await post(ucr);
    expect(res.status).toBe(200);
    expect(res.data).toEqual({
      success: true,
      status: 200,
      message: "Successful connection",
      data: {
        token: expect.any(String),
        session: expect.any(Number)
      }
    });
    sessionId = res.data.data.session; // Store the session ID for further tests
  });



  test("try to renew session after renewal", async () => {
    const ucr = { ...validUCR, user: { ...dummy2, session_id: sessionId} };
    delete ucr.user.password;
    delete ucr.user.identifier;
    ucr.request.url = "/test-ssv/session-connection-after-renewal";
    const res = await post(ucr);
    expect(res.status).toBe(200);
    expect(res.data).toEqual({
      success: true,
      status: 200,
      message: "Successful connection"
    });
  });


  test("session is not outdated anymore", async () => {
    const ucr = { ...validUCR, user: { ...dummy2, session_id: sessionId } };
    delete ucr.user.password;
    delete ucr.user.identifier;
    ucr.request.url = "/test-ssv/session-not-outdated";
    const res = await post(ucr);
    expect(res.status).toBe(200);
    expect(res.data).toEqual({
      success: true,
      status: 200,
      message: "Successful connection"
    });
  });
});


