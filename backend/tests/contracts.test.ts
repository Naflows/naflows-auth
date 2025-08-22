const { test, expect, describe } = require('@jest/globals');


const app = process.env.CONTRACTS_API_URL;
if (!app) {
  throw new Error("CONTRACTS_API_URL is not set. Please set it in your environment variables.");
}

const getNewServiceData = () => {
 return {
        userId: "1",
        identifier: "123456789",
        password: "W8JdVoy30xEa1hZ5aDVQ",
        details: {
          name: "Pookie Wookie Dookie",
          description: "Le Pookie Wookie Dookie est un service incroyable",
          ip_address: "3.5.1.1",
          dns: "test.service.naflows",
          settings: {
            rates : 100
          },
          storagePlan : {
            plan : "FREE",
            type : "LOCAL",
            size : 32
          }
        }
      }
}


describe("Core functions", () => {

  

  test("Contract issuance", async () => {
    const res = await fetch(app + "/contract-debug/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        aim_id: "test_aim_id",
        aim_type: "API",
        type: "ISSUED_REQUEST",
        forced: false,
        details: {
          route: "/test/route"
        }
      })
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({
      my_type: "RECEIVER",
      id: expect.any(String),
      signature: {
        contracted: "API",
        contractor: "NASS",
        contractor_id: "<nass_global_network>",
        associated_contract: expect.any(String),
        api_key: expect.any(String)
      },
      details: {
        route: "/test/route",
        user: null,
        session: null,
        contract_type: "ISSUED_REQUEST"
      },
      status: {
        active: true,
        force_action: false,
        ending_reason: null
      },
      time: {
        issued_at: expect.any(Number),
        completed_at: null,
        modified_at: expect.any(Number)
      }
    })
  });

  test("Service building : working", async() => {
    const res = await fetch(app + "/client/build/service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getNewServiceData())
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({
      _id : expect.any(String),
       id : expect.any(String),
       name : "Pookie Wookie Dookie",
       description : "Le Pookie Wookie Dookie est un service incroyable",
       created_by : "1",
       dns : "test.service.naflows",
       settings : {
         rates : 100
       },
       storage : {
           plan : "FREE",
           type : "LOCAL",
           size : 32
       },
       ip_address : "3.5.1.1",
       status: "INACTIVE",
       created_at: expect.any(Number),
       service_token : expect.any(String)
    });
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
      success : false,
      status : 401,
      message: "Unauthorized: Invalid credentials."
    });
  })

  test('Service building : not working (user credentials invalid)', async () => {
    const res = await fetch(app + "/client/build/service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...getNewServiceData(),
        userId: "invalid_user"
      })
    });

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data).toEqual({
      success : false,
      status : 401,
      message: "Unauthorized: Invalid credentials."
    });
  })
})