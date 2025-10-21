import { describe, test, expect, beforeAll } from "@jest/globals";
import middleware from "../../middleware/dir";
import secure from "../../secure/global/dir";
import mongoose, { Collection } from "mongoose";
import { fakeRes, fakeUCR, sleep } from "./utils";
import { services } from "../../secure/services/dir";
import { getPlans } from "../../secure/services/methods/get-plans";
import { db } from "../..";
import { ReplyType } from "../../types/.types/reply.type";
import { NassServiceToken, Service, ServiceToken } from "../../types/.types/collections.type";
import nass from "../../nass/dir";


beforeAll(async () => {
    // Ensure database connection is established before running tests
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/nass");
    }
});

describe("Test NASS Secure Verification Methods", () => {

    const blacklistedIP = {
        ip: "111.222.333.444",
        headers: {
            'user-agent': 'jest-test-agent'
        }
    }

    describe("Check Blacklist Middleware", () => {
        test("Non-Blacklisted IP", async () => {
            const req: any = {
                ip: "123.456.789.000"
            };
            // Excluding res because it is only used to serve the blacklist page
            const result = await middleware.check.blacklist(fakeRes, req.ip);
            expect(result.success).toBe(true);
            expect(result.status).toBe(200);
            expect(result.message).toBe("IP is not blacklisted.");
        });
        test("Add BlackListed IP", async () => {
            const result = await secure.blacklist(mongoose, blacklistedIP as any, fakeRes, "Testing blacklist");
            expect(result.success).toBe(false);
            expect(result.status).toBe(403);
            expect(result.message).toBe("Your IP has been blacklisted.");
        });

        test("Blacklisted IP", async () => {
            const req: any = {
                ip: blacklistedIP.ip
            };

            const result = await middleware.check.blacklist(fakeRes, req.ip);
            expect(result.success).toBe(false);
            expect(result.status).toBe(403);
            expect(result.message).toBe("Your IP is blacklisted.");
        });
    });

    describe("Check Rates Middleware", () => {
        test("Within Rate Limits", async () => {
            const result = await middleware.check.rates(fakeUCR());
            expect(result.success).toBe(true);
            expect(result.status).toBe(200);
            expect(result.message).toBe("Rate limit not exceeded, request recorded.");
        });

        test("Exceed Rate Limits", async () => {
            const ucr = fakeUCR();
            // Simulate exceeding rate limits by making multiple requests
            for (let i = 0; i < (parseInt(process.env.BLACKLIST_RATES || "100") + 1); i++) {
                await middleware.check.rates(ucr);
            }
            const result = await middleware.check.rates(ucr);
            expect(result.success).toBe(false);
            expect(result.status).toBe(429);
            expect(result.message).toBe("Rate limit exceeded. Too many requests.");
        });
    });


    describe("Services", () => {
        let developerKey: string = "";
        let serviceToken: ServiceToken;
        let serviceData: Service;

        test("Create Service", async () => {
            const d = await services.service.register({
                name: "Test Service for SCV",
                description: "A service created to test SCV middleware",
                ip_address: "123.456.789.000",
                dns: "test-scv.naflows.test",
                id: "test-scv-service",
                picture: "",
                banner: ""
            }, {
                rates: 100,
            }, {
                allow_public_visibility: true,
                allow_user_registration: true
            }, {
                id: 2
            }, {
                middleware: { data: { user_id: "2" } },
                body: {}
            }, fakeRes);
            expect(d.success).toBe(true);
            expect(d.status).toBe(200);
            expect(d.message).toBe("Service registered successfully.");
        });


        describe("Get Service", () => {
            test("Get Existing Service", async () => {
                const d = await services.service.get("test-scv-service");
                expect(d.success).toBe(true);
                expect(d.status).toBe(200);
                expect(d.message).toBe("Service found.");

                serviceData = d.data as Service;
                expect(serviceData).toBeDefined();
                expect(serviceData.id).toBe("test-scv-service");
            });

            test("Get Non-Existing Service", async () => {
                const d = await services.service.get("non-existing-service");
                expect(d.success).toBe(false);
                expect(d.status).toBe(404);
                expect(d.message).toBe("Service not found.");
            });
        });


        describe("Original Rights Succesfully Created", () => {
            test("Check Original Rights", async () => {
                const rights = await services.service.rights.getAll("test-scv-service");
                // Check that there is a "Developer" and "Administrator" right with specific rights
                const developerRight = rights.find(r => r.name === "Developer");
                const administratorRight = rights.find(r => r.name === "Administrator");

                expect(developerRight).toBeDefined();
                expect(administratorRight).toBeDefined();

                // Check specific rights for each role
                expect(developerRight?.rights).toEqual(expect.arrayContaining(["MANAGE_TUNNELS", "MANAGE_DEVS", "VIEW_STATS", "DEV_TOKEN_CREATION"]));
                expect(administratorRight?.rights).toEqual(expect.arrayContaining(["MANAGE_TUNNELS", "MANAGE_DEVS", "VIEW_STATS", "READ", "WRITE", "DELETE", "MANAGE_USERS", "MANAGE_ROLES", "MANAGE_SERVICE", "MANAGE_SETTINGS", "VIEW_USERS", "VIEW_ROLES", "VIEW_SERVICE", "VIEW_SETTINGS", "DEV_TOKEN_CREATION", "PROD_TOKEN_CREATION"]));
            });
        })

        describe("Owner Rights Succesfully Assigned", () => {
            test("Check Owner Rights", async () => {
                const rights = await services.service.user.getRights("2", "test-scv-service");
                // Check that the user has both "Developer" and "Administrator" rights
                const hasDeveloperRight = rights.some(r => r.name === "Developer");
                const hasAdministratorRight = rights.some(r => r.name === "Administrator");

                expect(hasDeveloperRight).toBe(true);
                expect(hasAdministratorRight).toBe(true);
            });

            test("Get User Developer Key", async () => {
                const devKey = await services.service.dev.getKey("2", "test-scv-service");

                expect(devKey).toBeDefined();

                developerKey = devKey;
            })
        });

        describe("Manage Service Token", () => {
            const tokens = db.collection("service_tokens") as Collection<NassServiceToken>;

            test("Generate Service Token", async () => {
                const regenerateResult: ReplyType = await services.token.new("test-scv-service", developerKey, "AUTO");
                expect(regenerateResult.success).toBe(true);
                expect(regenerateResult.status).toBe(200);
                expect(regenerateResult.message).toBe("Service token inserted successfully.");

                const tokenID = regenerateResult.data.serviceToken.id;

                expect(tokenID).toBeDefined();

                const serviceTokens: NassServiceToken[] = (await tokens.find({ service_id: "test-scv-service" }).toArray());
                // Check that all previous tokens except the new one are invalidated
                const invalidatedTokens = await tokens.find({ service_id: "test-scv-service", invalidated: true }).toArray();
                expect(invalidatedTokens.length).toBe(serviceTokens.length - 1);
                const newToken = await tokens.findOne({ id: tokenID, service_id: "test-scv-service" });
                expect(newToken).toBeDefined();
                expect(newToken?.invalidated).toBeFalsy();

                serviceToken = { id: newToken.id, token: regenerateResult.data.serviceToken.token, created_at: newToken.created_at };
            });
        });

        describe("Check Request Origin Middleware", () => {
            test("Service is Not Active", async () => {
                // These are valid data but the service is not active
                const result = await middleware.check.origin({
                    ip: serviceData.ip_address[0],
                    dns: serviceData.dns,
                    service: serviceData.id,
                    service_token: serviceToken.token,
                    service_token_birth: serviceToken.created_at
                });
                expect(result.success).toBe(false);
                expect(result.status).toBe(403);
                expect(result.message).toBe("Unauthorized service access.");
            });

            test("Activate Service", async () => {
                await nass.instance.connection({
                    body: {
                        serviceID: serviceData.id
                    },
                    middleware: { data: { user_id: "2" } }
                } as any, fakeRes);

                sleep(1000); // Wait a second for the status to update

                const d = await services.service.get(serviceData.id);
                expect(d.success).toBe(true);
                const updatedService = d.data as Service;
                expect(updatedService.status).toBe("ACTIVE");
            });


            test("Valid Request Origin", async () => {
                const result = await middleware.check.origin({
                    ip: serviceData.ip_address[0],
                    dns: serviceData.dns,
                    service: serviceData.id,
                    service_token: serviceToken.token,
                    service_token_birth: serviceToken.created_at
                });
                expect(result.success).toBe(true);
                expect(result.status).toBe(200);
                expect(result.message).toBe("Service access granted.");
            });

            test("Invalid Request Origin - Wrong IP", async () => {
                const result = await middleware.check.origin({
                    ip: "999.888.777.666",
                    dns: serviceData.dns,
                    service: serviceData.id,
                    service_token: serviceToken.token,
                    service_token_birth: serviceToken.created_at
                });
                expect(result.success).toBe(false);
                expect(result.status).toBe(403);
                expect(result.message).toBe("Unauthorized service access.");
            });

            test("Invalid Request Origin - Wrong DNS", async () => {
                const result = await middleware.check.origin({
                    ip: serviceData.ip_address[0],
                    dns: "wrong.dns.test",
                    service: serviceData.id,
                    service_token: serviceToken.token,
                    service_token_birth: serviceToken.created_at
                });
                expect(result.success).toBe(false);
                expect(result.status).toBe(403);
                expect(result.message).toBe("Unauthorized service access.");
            });

            test("Invalid Request Origin - Wrong Service Token", async () => {
                const result = await middleware.check.origin({
                    ip: serviceData.ip_address[0],
                    dns: serviceData.dns,
                    service: serviceData.id,
                    service_token: "invalid_token_value",
                    service_token_birth: serviceToken.created_at
                });
                expect(result.success).toBe(false);
                expect(result.status).toBe(403);
                expect(result.message).toBe("Invalid service token.");
            });

            test("Invalid Request Origin - Wrong Service Token Birth", async () => {
                const result = await middleware.check.origin({
                    ip: serviceData.ip_address[0],
                    dns: serviceData.dns,
                    service: serviceData.id,
                    service_token: serviceToken.token,
                    service_token_birth: serviceToken.created_at - 10000
                });
                expect(result.success).toBe(false);
                expect(result.status).toBe(403);
                expect(result.message).toBe("Invalid service token.");
            });
        });
    });

    describe("UCR Check", () => {
        describe("UCR is valid", () => {
            test("Token Only", async () => {
                const ucr = fakeUCR();
                delete ucr.user.identifier;
                delete ucr.user.password;
                const result = await middleware.check.ucr(ucr);
                expect(result).toBe(true);
            });
            test("Identifier + Password", async () => {
                const ucr = fakeUCR({ identifier: "jest-test-identifier", password: "jest-test-password" });
                delete ucr.user.token;
                const result = await middleware.check.ucr(ucr);
                expect(result).toBe(true);
            });
        });

        describe("UCR is invalid", () => {
            test("No Token, Identifier or Password", async () => {
                const ucr = fakeUCR();
                delete ucr.user.token;
                delete ucr.user.identifier;
                delete ucr.user.password;
                const result = await middleware.check.ucr(ucr);
                expect(result).toBe(false);
            });
            test("Token, Identifier and Password", async () => {
                const ucr = fakeUCR({ identifier: "jest-test-identifier", password: "jest-test-password" });
                const result = await middleware.check.ucr(ucr);
                expect(result).toBe(false);
            });
        });
    })
});