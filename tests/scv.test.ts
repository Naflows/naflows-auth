import UCRType from "../types/.types/ucr.type";

const { test, expect, describe } = require('@jest/globals');
const axios = require('axios');


const app = "http://localhost:3000/test";
let validUCR: UCRType = {
  user: {
    ip : "1.1.1.2",
    agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    session_id: 1,
    token: "test-token",
    device_fingerprint: "fingerprint-1",
    user_origin: "NASS",
    user_id: 2
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

validUCR.user.ip = "1.1.1.1";
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

validUCR.user.ip = "1.1.1.2";
test("UCR is invalid (password + token + identifier)", async () => {
  const ucr = validUCR;
  ucr.user.identifier = "identifier";
  ucr.user.password = "password";
  ucr.user.token = "token"; // Invalid combination of credentials

  try {
    await axios.post(`${app}`, ucr);
  } catch (error) {
    expect(error.response.status).toBe(400);
    expect(error.response.data).toBe("Invalid request format.");
  }
});

validUCR.user.ip = "1.1.1.3";
test("UCR is invalid (missing random parameters)", async () => {
  const ucr = validUCR as any;
  ucr.user.device_fingerprint = undefined; // Missing device fingerprint

  try {
    await axios.post(`${app}`, ucr);
  } catch (error) {
    expect(error.response.status).toBe(400);
    expect(error.response.data).toBe("Invalid request format.");
  }
});

validUCR.user.ip = "1.1.1.4";
test("Service connection is invalid (incorrect service IP address)", async () => {
  const ucr = validUCR;
  ucr.client.ip = "123.123.123.1";
  ucr.client.service_token = "test-service-token"; // Valid token but incorrect IP
  ucr.user.device_fingerprint = "fingerprint"; // Valid fingerprint
  try {
    await axios.post(`${app}`, ucr);
  } catch (error) {
    expect(error.response.status).toBe(403);
    expect(error.response.data).toBe("Unauthorized service access.");
  }
})

validUCR.user.ip = "1.1.1.5";
test("Service connection is invalid (incorrect token creation time)", async () => {
  const ucr = validUCR;
  ucr.client.ip = "127.0.0.1";
  ucr.client.service_token_birth = 156321; // Token creation time is in the past
  ucr.client.service_token = "test-service-token"; // Valid token but incorrect creation time
  try {
    await axios.post(`${app}`, ucr);
  } catch (error) {
    expect(error.response.status).toBe(403);
    expect(error.response.data).toBe("Invalid service token.");
  }
})

validUCR.user.ip = "1.1.1.6";
test("Service connection is invalid (incorrect token)", async () => {
  const ucr = validUCR;
  ucr.client.service_token = "invalid-token"; // Invalid service token
  try {
    await axios.post(`${app}`, ucr);
  } catch (error) {
    expect(error.response.status).toBe(403);
    expect(error.response.data).toBe("Invalid service token.");
  }
})

validUCR.user.ip = "1.1.1.7";
test("Service is outdated (service is not active)", async () => {
  const ucr = validUCR;
  ucr.client.service = "Test Service : expired";
  ucr.client.service_token = "test-service-token-inactive"; // Valid token but service is not active
  ucr.client.service_token_birth = 1749676800;
  try {
    await axios.post(`${app}`, ucr);
  } catch (error) {
    expect(error.response.status).toBe(403);
    expect(error.response.data).toBe("Unauthorized service access.");
  }
})

validUCR.user.ip = "1.1.1.8";
test("Service token is expired (token is not valid anymore)", async () => {
  const ucr = validUCR;
  ucr.client.service = "Test Service : token is expired";
  ucr.client.service_token = "test-service-token-expired"; // Valid token but service token is expired
  ucr.client.service_token_birth = 1749962909; // Token creation time is in the past
  try {
    await axios.post(`${app}`, ucr);
  } catch (error) {
    expect(error.response.status).toBe(409);
    expect(error.response.data).toBe("Conflict between service's token and NASS. Forcing reload. This might take a few seconds.");
  }
});


// Reseting the valid UCR for the next tests but changing IP adress 
const tmrUCR = {
  user: {
    ip: "135.215.3.111",
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
    service_token_birth: 1749676800
  },
  request: {
    method: "POST",
    url: "/test/too-many-requests",
    headers: {
      "Content-Type": "application/json"
    },
    body: { key: "value" },
    query: { param: "value" },
    request_date: 1700000000,
  }
};

test("Rates limit exceeded (too many requests)", async () => {
  const rates = process.env.BLACKLIST_RATES ? parseInt(process.env.BLACKLIST_RATES) : 100;
  const ucr = tmrUCR;
   for (let i = 0; i < rates*2; i++) {
    try {
      await axios.post(`${app}`, ucr);
    } catch (error) {
      if (error.response.status === 429) {
        expect(error.response.data).toBe("Rate limit exceeded. Too many requests.");
        break;
      }
    }
   }

});


