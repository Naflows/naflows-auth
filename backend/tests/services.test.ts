import { ServiceToken } from "../types/.types/collections.type";

const { test, expect, describe } = require('@jest/globals');


const app = process.env.SERVICES_API_URL;
if (!app) {
  throw new Error("SERVICES_API_URL is not set. Please set it in your environment variables.");
}

const getNewServiceData = () => {
  return {
    userID: "1",
    identifier: "123456789",
    password: "W8JdVoy30xEa1hZ5aDVQ",
    details: {
      name: "Pookie Wookie Dookie",
      description: "Le Pookie Wookie Dookie est un service incroyable",
      ip_address: "3.5.1.1",
      dns: "test.service.naflows",
      settings: {
        rates: 100
      },
      storagePlan: {
        plan: "FREE",
        type: "LOCAL",
        size: 32
      }
    }
  }
}


describe("Core functions", () => {

  let newServiceID;


  test("Service building : working", async () => {
    const res = await fetch(app + "/client/build/service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getNewServiceData())
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({
      _id: expect.any(String),
      id: expect.any(String),
      name: "Pookie Wookie Dookie",
      description: "Le Pookie Wookie Dookie est un service incroyable",
      created_by: "1",
      dns: "test.service.naflows",
      settings: {
        rates: 100
      },
      storage: {
        plan: "FREE",
        type: "LOCAL",
        size: 32
      },
      ip_address: "3.5.1.1",
      status: "INACTIVE",
      created_at: expect.any(Number),
      service_token: expect.any(String)
    });
    newServiceID = data.id;
  })

  test('Service building : not working (user password invalid)', async () => {
    const res = await fetch(app + "/client/build/service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...getNewServiceData(),
        password: "invalid_password"
      })
    });

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data).toEqual({
      success: false,
      status: 401,
      message: "Unauthorized: Invalid credentials."
    });
  })

  test('Service building : not working (user credentials invalid)', async () => {
    const res = await fetch(app + "/client/build/service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...getNewServiceData(),
        userID: "invalid_user"
      })
    });

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data).toEqual({
      success: false,
      status: 401,
      message: "Unauthorized: Invalid credentials."
    });
  })



  test('Get API key : not working (invalid user)', async () => {
    const res = await fetch(app + "/contract-debug/get-api-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: "invalid_user",
        serviceID: newServiceID,
        password: getNewServiceData().password,
        identifier: getNewServiceData().identifier
      })
    });
    const data = await res.json();
    expect(res.status).toBe(401);
    expect(data).toEqual({
      success: false,
      status: 401,
      message: "Unauthorized: Invalid credentials."
    });
  })

  test('Get API key : not working (invalid credentials)', async () => {
    const res = await fetch(app + "/contract-debug/get-api-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: getNewServiceData().userID,
        serviceID: newServiceID,
        identifier: getNewServiceData().identifier,
        password: "bleh"
      })
    });
    const data = await res.json();
    expect(res.status).toBe(401);
    expect(data).toEqual({
      success: false,
      status: 401,
      message: "Unauthorized: Invalid credentials."
    });
  })

  let token: ServiceToken;
  test('Get API key : working', async () => {
    const res = await fetch(app + "/contract-debug/get-api-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: getNewServiceData().userID,
        serviceID: newServiceID,
        password: getNewServiceData().password,
        identifier: getNewServiceData().identifier
      })
    });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual({
      success: true,
      status: 200,
      message: "Service token inserted successfully.",
      data: {
        id: expect.any(String),
        token: expect.any(String),
        created_at: expect.any(Number)
      }
    });
    token = data.data;
  })


  test('Validate API Key : not working (invalid token)', async () => {
    const res = await fetch(app + "/contract-debug/validate-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceID: newServiceID,
        token: "wrong token",
        creation_date: token.created_at
      })
    });
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data).toEqual(false);
  })
  test('Validate API Key : not working (invalid creation date)', async () => {
    const res = await fetch(app + "/contract-debug/validate-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceID: newServiceID,
        token: token.token,
        creation_date: 4
      })
    });
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data).toEqual(false);
  })

  test('Validate API Key : working', async () => {
    const res = await fetch(app + "/contract-debug/validate-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceID: newServiceID,
        token: token.token,
        creation_date: token.created_at
      })
    });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual(true);
  })
})