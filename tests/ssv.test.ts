
/*

    Things to test: 
    * Identifier
    * Password
    * Token (ONLY TEST TOKEN VALUE, STV COMES LATER)
    * Session creation

*/

import UCRType from "../types/.types/ucr.type";

const { test, expect, describe } = require('@jest/globals');
const axios = require('axios');


const app = "http://localhost:3000/test";

const dummy1 = {
    ip : "1.1.1.2",
    agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    device_fingerprint: "fingerprint-1",
    user_origin : "NASS",
    session_id : "1",
    token : "test-token",
    identifier : "dummy",
    password : "dummy",
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
}

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

describe("User session is valid", () => {
  test("password + identifier", async () => {
      const ucr = JSON.parse(JSON.stringify(validUCR));
      ucr.user = { ...dummy1 };
      delete ucr.user.token;
      const response = await axios.post(`${app}`, ucr);
      expect(response.status).toBe(200);
      expect(response.data).toBe("Successful connection");
  })

  test("token", async () => {
    const ucr = JSON.parse(JSON.stringify(validUCR));
    ucr.user = { ...dummy1 };
    delete ucr.user.password;
    delete ucr.user.identifier;
    ucr.user.token = dummy1.token;
    const response = await axios.post(`${app}`, ucr);
    expect(response.status).toBe(200);
    expect(response.data).toBe("Successful connection");
  })
})

describe("User data is invalid", () => {
  test("token is invalid", async () => {
    const ucr = JSON.parse(JSON.stringify(validUCR));
    ucr.user = { ...dummy1 };
    ucr.user.token = "invalid-token";
    try {
      await axios.post(`${app}`, ucr);
    } catch (error) {
      expect(error.response.status).toBe(401);
      expect(error.response.data).toBe("Invalid user credentials.");
    }
  })

  test("password is invalid", () => {
    const ucr = JSON.parse(JSON.stringify(validUCR));
    ucr.user = { ...dummy1 };
    ucr.user.password = "invalid-password";
    try {
      axios.post(`${app}`, ucr);
    } catch (error) {
      expect(error.response.status).toBe(401);
      expect(error.response.data).toBe("Invalid user credentials.");
    }
  })

  test("identifier is invalid", () => {
    const ucr = JSON.parse(JSON.stringify(validUCR));
    ucr.user = { ...dummy1 };
    ucr.user.identifier = "invalid-identifier";
    try {
      axios.post(`${app}`, ucr);
    } catch (error) {
      expect(error.response.status).toBe(401);
      expect(error.response.data).toBe("Unknown user credentials.");
    }
  })

  test("unknown session", () => {
    const ucr = JSON.parse(JSON.stringify(validUCR));
    ucr.user = { ...dummy1 };
    ucr.user.session_id = "unknown-session";
    try {
      axios.post(`${app}`, ucr);
    } catch (error) {
      expect(error.response.status).toBe(401);
      expect(error.response.data).toBe("Unknown user session.");
    }
  })
});

describe("Session data is missing", () => {
  test("missing / invalid device fingerprint", async () => {
    const ucr = JSON.parse(JSON.stringify(validUCR));
    ucr.user = { ...dummy1 };
    ucr.user.device_fingerprint = undefined; // Missing device fingerprint
    try {
      await axios.post(`${app}`, ucr);
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toBe("Invalid request format.");
    }
  });

  test("missing / invalid user origin", async () => {
    const ucr = JSON.parse(JSON.stringify(validUCR));
    ucr.user = { ...dummy1 };
    ucr.user.user_origin = "wrong-user-origin"; // Missing user origin
    try {
      await axios.post(`${app}`, ucr);
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toBe("Invalid request format.");
    }
  });

  test("missing / invalid user agent", async () => {
    const ucr = JSON.parse(JSON.stringify(validUCR));
    ucr.user = { ...dummy1 };
    ucr.user.agent = "wrong-user-agent"; // Missing user agent
    try {
      await axios.post(`${app}`, ucr);
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toBe("Invalid request format.");
    }
  });

  test("missing / invalid user IP", async () => {
    const ucr = JSON.parse(JSON.stringify(validUCR));
    ucr.user = { ...dummy1 };
    ucr.user.ip = "195.135.264.123"; // Missing user IP
    try {
      await axios.post(`${app}`, ucr);
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toBe("Invalid request format.");
    }
  });
})


describe("Session is outdated", () => {
  test("session is outdated", async () => {
    const ucr = JSON.parse(JSON.stringify(validUCR));
    ucr.user = { ...dummy2 };
    try {
      await axios.post(`${app}`, ucr);
    } catch (error) {
      expect(error.response.status).toBe(401);
      expect(error.response.data).toBe("Session is outdated.");
    }
  });
})