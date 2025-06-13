import UCRType from "../types/.types/ucr.type";

const { test, expect } = require('@jest/globals');
const axios = require('axios');


const app = "http://localhost:3000/test";
let validUCR: UCRType = {
  user: {
    ip: "192.168.1.111",
    agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    session_id: "session123",
    token: "token",
    device_fingerprint: "fingerprint",
    user_origin: "/test/"
  },
  client: {
    ip: "127.0.0.1",
    dns: "local.nass.com",
    service: "Test Service : token is not expired",
    service_token: "test-service-token",
    service_token_birth: 123456789
  },
  request: {
    method: "POST",
    url: "/test",
    headers: {
      "Content-Type": "application/json"
    },
    body: { key: "value" },
    query: { param: "value" },
    request_date: 1700000000,
  }
};

test("UCR is valid (correct informations | token)", async () => {
  const response = await axios.post(`${app}`, validUCR);
  // Expect status 200 with message "successful connection"
  expect(response.status).toBe(200);
  expect(response.data).toBe("Successful connection");
});

test("UCR is valid (correct informations | password + identifier)", async () => {
  const ucr = validUCR;
  delete ucr.user.token;
  ucr.user.identifier = "identifier";
  ucr.user.password = "password";

  const response = await axios.post(`${app}`, ucr);
  // Expect status 200 with message "successful connection"
  expect(response.status).toBe(200);
  expect(response.data).toBe("Successful connection");
});

test("UCR is invalid (password + token + identifier)", async () => {
  const ucr = validUCR;
  ucr.user.identifier = "identifier";
  ucr.user.password = "password";

  try {
    await axios.post(`${app}`, ucr);
  } catch (error) {
    expect(error.response.status).toBe(400);
    expect(error.response.data).toBe("Invalid request format.");
  }
});

test("UCR is invalid (missing random parameters)", async () => {
  const ucr = validUCR as any;
  delete ucr.user.device_fingerprint; // Missing device fingerprint
  delete ucr.client.service_token; // Missing service token

  try {
    await axios.post(`${app}`, ucr);
  } catch (error) {
    expect(error.response.status).toBe(400);
    expect(error.response.data).toBe("Invalid request format.");
  }
});

// test("UCR is valid (correct service & token)", async () => {
//   const ucr = validUCR;
//   ucr.client.ip = "127.0.0.1";
//   ucr.client.dns = "local.nass.com";
//   ucr.client.service = "Test service : token is not expired";
//   ucr.client.service_token = "test-service-token";
//   ucr.client.service_token_birth = 123456789;
// })