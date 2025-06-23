import UCRType from "../types/.types/ucr.type";
const { test, expect, describe } = require('@jest/globals');

// --- CONFIG
const app = "http://localhost:3000/test";

// --- USERS from V2
const dummy1 = {
  ip: "1.1.1.2",
  agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
  device_fingerprint: "fingerprint-1",
  user_origin: "NASS",
  session_id: 1,
  token: "test-token",
  identifier: "dummy",
  password: "dummy",
  user_id: 2
};

const dummy2 = {
  ip: "1.1.1.3",
  agent: dummy1.agent,
  device_fingerprint: "fingerprint-2",
  user_origin: "NASS",
  session_id: 2,
  token: "test-token-2",
  identifier: "dummy1",
  password: "dummy1",
  user_id: 3
};

// --- BASE UCR FACTORY
const getValidUCR = (userOverride: Partial<UCRType["user"]> = {}): UCRType => ({
  user: {
    ...dummy1,
    ...userOverride
  },
  client: {
    ip: "127.0.0.1",
    dns: "local.nass.com",
    service: "Test Service : token is not expired",
    service_token: "test-service-token",
    service_token_birth: 1750658147765
  },
  request: {
    method: "POST",
    url: "/test",
    headers: { "Content-Type": "application/json" },
    body: { key: "value" },
    query: { param: "value" },
    request_date: 1700000000,
  }
});

// --- POST WRAPPER (fetch + json)
async function post(ucr: any) {
  const res = await fetch(app, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ucr)
  });
  const data = await res.json();
  return { status: res.status, data };
}

// --- TESTS

test("UCR is valid (token only)", async () => {
  const ucr = getValidUCR({ identifier: undefined, password: undefined });
  const res = await post(ucr);
  expect(res.status).toBe(200);
  expect(res.data).toEqual({
    success: true,
    status: 200,
    message: "Successful connection"
  });
});

test("UCR is valid (identifier + password)", async () => {
  const ucr = getValidUCR({ token: undefined });
  const res = await post(ucr);
  expect(res.status).toBe(200);
  expect(res.data).toEqual({
    success: true,
    status: 200,
    message: "Successful connection"
  });
});

test("UCR is invalid (token + identifier + password)", async () => {
  const ucr = getValidUCR({
    token: "invalid-token",
    identifier: "dummy",
    password: "dummy"
  });
  ucr.request.url = "/test/invalid-token-with-identifier-password";
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
  ucr.client.service = "Test Service : expired";
  ucr.client.service_token = "test-service-token-inactive";
  ucr.client.service_token_birth = 1749676800;
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
  ucr.client.service = "Test Service : token is expired";
  ucr.client.service_token = "test-service-token-expired";
  ucr.client.service_token_birth = 1749962909;
  ucr.request.url = "/test/expired-token";
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
  const ucr = getValidUCR({ ip: "135.215.3.111" });
  ucr.request.url = "/test/too-many-requests";
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
