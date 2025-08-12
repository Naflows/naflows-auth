const { test, expect, describe } = require('@jest/globals');


const app = process.env.CONTRACTS_API_URL;
console.log("CONTRACTS_API_URL:", app);
if (!app) {
  throw new Error("CONTRACTS_API_URL is not set. Please set it in your environment variables.");
}


describe("Basic features", () => {
  test("Contract issuance", async () => {
    const res = await fetch(app + "generate", {
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
})