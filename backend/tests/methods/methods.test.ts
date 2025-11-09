import { describe, test, expect, beforeAll } from "@jest/globals";
import middleware from "../../middleware/dir";
import secure from "../../secure/global/dir";
import mongoose, { Collection } from "mongoose";
import { getFakeRes, fakeUCR, fakeUserSession, getFakeReq, sleep, getFakeNext } from "./utils";
import { services } from "../../secure/services/dir";
import { getPlans } from "../../secure/services/methods/get-plans";
import { db } from "../..";
import { ReplyType } from "../../types/.types/reply.type";
import { NassServiceToken, Service, ServiceToken, UserSession } from "../../types/.types/collections.type";
import nass from "../../nass/dir";
import { before } from "node:test";
import { sessionRenewal } from "../../middleware/methods/ssv/session-renewal";
import { checkTokenRights } from "../../middleware/methods/stv/check-rights";
import { software } from "../../software/dir";



describe("Test NASS Secure Verification Methods", () => {

    const blacklistedIP = {
        ip: "111.222.333.444",
        headers: {
            'user-agent': 'jest-test-agent'
        }
    }
    let developerKey: string = "";
    let serviceKey: string = "";
    let user;
    let newSessionID: string = "";
    let newSessionToken: string = "";
    let serviceToken: ServiceToken;
    let serviceData: Service;

    let serviceUCRData: {
        ip: string;
        dns: string;
        service: string;
        service_token: string;
        service_token_birth: number;
    } = {
        ip: "::ffff:172.18.0.6",
        dns: "local.nass.com",
        service: "1",
        service_token: "test-service-token",
        service_token_birth: 1750658147765
    }

    describe("Check Blacklist Middleware", () => {
        test("Non-Blacklisted IP", async () => {
            // Excluding res because it is only used to serve the blacklist page
            const result = await middleware.check.blacklist(getFakeRes(), "123.456.789.000");
            expect(result.success).toBe(true);
            expect(result.status).toBe(200);
            expect(result.message).toBe("IP is not blacklisted.");
        });
        test("Add BlackListed IP", async () => {
            const result = await secure.blacklist(mongoose, blacklistedIP as any, getFakeRes(), "Testing blacklist");
            expect(result.success).toBe(false);
            expect(result.status).toBe(403);
            expect(result.message).toBe("Your IP has been blacklisted.");
        });

        test("Blacklisted IP", async () => {
            const req: any = {
                ip: blacklistedIP.ip
            };

            const result = await middleware.check.blacklist(getFakeRes(), req.ip);
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

        // Works but takes too much time so uh don't uncomment for now
        // test("Within Rate Limits After Timeout", async () => {
        //     const ucr = fakeUCR();
        //     // Simulate a timeout

        //     await new Promise(resolve => setTimeout(resolve, (parseInt(process.env.BLACKLIST_RATES_TIMEOUT || "60") + 1) * 1000));
        //     const result = await middleware.check.rates(ucr);
        //     expect(result.success).toBe(true);
        //     expect(result.status).toBe(200);
        //     expect(result.message).toBe("Rate limit not exceeded, request recorded.");
        // });
    });
    describe("Services", () => {

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
            }, getFakeRes());
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

                serviceData = d.data.service as Service;
                expect(serviceData).toBeDefined();
                expect(serviceData.id).toBe("test-scv-service");

                serviceUCRData.ip = serviceData.ip_address[0];
                serviceUCRData.dns = serviceData.dns;
                serviceUCRData.service = serviceData.id;
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

                expect(developerKey).toBeDefined();

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

                serviceUCRData.service_token = serviceToken.token;
                serviceUCRData.service_token_birth = serviceToken.created_at;
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
                } as any, getFakeRes());

                sleep(1000); // Wait a second for the status to update

                const d = await services.service.get(serviceData.id);
                expect(d.success).toBe(true);
                const updatedService = d.data.service as Service;
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

            // ##############################################################
            // UNAVAILABLE FOR NOW
            // test("Invalid Request Origin - Wrong DNS", async () => {
            //     const result = await middleware.check.origin({
            //         ip: serviceData.ip_address[0],
            //         dns: "wrong.dns.test",
            //         service: serviceData.id,
            //         service_token: serviceToken.token,
            //         service_token_birth: serviceToken.created_at
            //     });
            //     expect(result.success).toBe(false);
            //     expect(result.status).toBe(403);
            //     expect(result.message).toBe("Unauthorized service access.");
            // });
            // ##############################################################

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

            test("Validate SCV Middleware", async () => {
                // Even if the tested middleware is SCV, we need to use UCR 
                const ucr = fakeUCR();
                ucr.client = {
                    ip: serviceData.ip_address[0],
                    dns: serviceData.dns,
                    service: serviceData.id,
                    service_token: serviceToken.token,
                    service_token_birth: serviceToken.created_at
                };
                ucr.user.token = undefined;
                const req = getFakeReq(ucr);
                const res = getFakeRes();
                const result = await middleware.process.scv(req, res);
                expect(result.success).toBe(true);
                expect(result.status).toBe(200);
                expect(result.message).toBe("SCV Process completed successfully.");
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
    });


    describe("Secure Session Verification", () => {
        beforeAll(async () => {
            user = await secure.user.get("2", false);
            if (user == undefined) {
                throw new Error("User with ID 2 not found for session renewal tests.");
            }
        });


        describe("Session is invalid", () => {
            test("Cannot renew session with invalid credentials", async () => {
                const ucr = fakeUCR({ identifier: "jest-test-identifier", password: "jest-test-password" });
                delete ucr.user.token;
                const renew = await sessionRenewal(ucr, user, fakeUserSession);
                expect(renew.success).toBe(false);
                expect(renew.status).toBe(401);
                expect(renew.message).toBe("Invalid credentials provided.");
            });

            describe("Renew session with valid credentials", () => {
                let renewalToken: string = "";

                test("Get Renewal Token", async () => {
                    const ucr = fakeUCR();
                    ucr.client = serviceUCRData;
                    delete ucr.user.token;
                    const renew = await sessionRenewal(ucr, user, fakeUserSession);
                    expect(renew.success).toBe(false);
                    expect(renew.status).toBe(401);
                    expect(renew.message).toBe("Session is outdated.");
                    expect(renew.data).toBeDefined();
                    expect((renew.data as any).token).toBeDefined();

                    renewalToken = (renew.data as any).token;

                    expect(renewalToken).toBeDefined();
                });

                test("Renew Session Successfully", async () => {
                    const ucr = fakeUCR();
                    ucr.client = serviceUCRData;
                    delete ucr.user.token;
                    ucr.data["session-renewal-token"] = renewalToken;
                    const renew = await sessionRenewal(ucr, user, fakeUserSession);
                    expect(renew.success).toBe(true);
                    expect(renew.status).toBe(201);
                    expect(renew.message).toBe("Session renewed successfully with code 201.");
                    expect(renew.data).toBeDefined();
                    expect((renew.data as any).session).toBeDefined();

                    newSessionID = (renew.data as any).session;

                    expect(newSessionID).toBeDefined();
                });
            });
        });
    });

    test("Get API Key for Service", async () => {
        const ucr = fakeUCR();
        ucr.user.session_id = newSessionID;
        ucr.client = {
            ip: serviceData.ip_address[0],
            dns: serviceData.dns,
            service: serviceData.id,
            service_token: serviceToken.token,
            service_token_birth: serviceToken.created_at
        };
        delete ucr.user.token;
        const req = getFakeReq({
            ...ucr,
            service_id: serviceData.id
        });

        const res = getFakeRes();


        const a = await services.routes.serviceKey(req, res, (await secure.user.get("2", false))!);
        const apiKeyResult = a.data;
        expect(apiKeyResult.success).toBe(true);
        expect(apiKeyResult.status).toBe(200);
        expect(apiKeyResult.message).toBe("API Key retrieved successfully.");

        const apiKey = apiKeyResult.data.key;
        expect(apiKey).toBeDefined();
        serviceKey = apiKey;
    });


    let sessionID = "";
    newSessionToken = "";

    describe("Secure Token Verification", () => {
        // First, create rights for tunneling in order to test SCV with tunneling rights
        const rightsIds = {
            admin: "",
            dev: "",
            noWork: ""
        }
        const devKey = developerKey;
        describe("Tunneling Rights Check", () => {

            beforeAll(() => {
                expect(serviceKey).toBeDefined();
                expect(serviceData).toBeDefined();
            })

            test("Create Right 'admin', 'dev', 'no-work' for tunneling", async () => {
                const admin = await services.service.rights.create("test-scv-service", "admin", ["MANAGE_TUNNELS", "MANAGE_DEVS", "VIEW_STATS", "READ", "WRITE", "DELETE", "MANAGE_USERS", "MANAGE_ROLES", "MANAGE_SERVICE", "MANAGE_SETTINGS", "VIEW_USERS", "VIEW_ROLES", "VIEW_SERVICE", "VIEW_SETTINGS", "DEV_TOKEN_CREATION", "PROD_TOKEN_CREATION"], false, "TUNNELING_BY_INSTANCE");
                const dev = await services.service.rights.create("test-scv-service", "dev", ["MANAGE_TUNNELS", "MANAGE_DEVS", "VIEW_STATS", "DEV_TOKEN_CREATION"], false, "TUNNELING_BY_INSTANCE");
                const nowork = await services.service.rights.create("test-scv-service", "no-work", ["NO_WORK_RIGHT"], false, "TUNNELING_BY_INSTANCE");

                expect(admin.success).toBe(true);
                expect(dev.success).toBe(true);
                expect(nowork.success).toBe(true);
                expect(admin.data.right).toBeDefined();
                expect(dev.data.right).toBeDefined();
                expect(nowork.data.right).toBeDefined();
                rightsIds.admin = admin.data.right.id;
                rightsIds.dev = dev.data.right.id;
                rightsIds.noWork = nowork.data.right.id;
                expect(rightsIds.admin).toBeDefined();
                expect(rightsIds.dev).toBeDefined();
                expect(rightsIds.noWork).toBeDefined();
            });

            test("Rights Created Exist", async () => {
                const adminRight = await services.service.rights.get(rightsIds.admin, "test-scv-service", "TUNNELING_BY_INSTANCE");
                const devRight = await services.service.rights.get(rightsIds.dev, "test-scv-service", "TUNNELING_BY_INSTANCE");
                const noWorkRight = await services.service.rights.get(rightsIds.noWork, "test-scv-service", "TUNNELING_BY_INSTANCE");

                expect(adminRight).toBeDefined();
                expect(devRight).toBeDefined();
                expect(noWorkRight).toBeDefined();
            });

            test("Cannot create a role with name that already exists", async () => {
                const duplicateRight = await services.service.rights.create("test-scv-service", "admin", ["MANAGE_TUNNELS", "MANAGE_DEVS", "VIEW_STATS", "READ", "WRITE", "DELETE", "MANAGE_USERS", "MANAGE_ROLES", "MANAGE_SERVICE", "MANAGE_SETTINGS", "VIEW_USERS", "VIEW_ROLES", "VIEW_SERVICE", "VIEW_SETTINGS", "DEV_TOKEN_CREATION", "PROD_TOKEN_CREATION"], false, "TUNNELING_BY_INSTANCE");
                expect(duplicateRight.success).toBe(false);
                expect(duplicateRight.status).toBe(409);
                expect(duplicateRight.message).toBe("A rights set with this name already exists in the service.");
            });

            // Note : any method queried from the nass doesn't use res directly, but returns data instead.
            test("Create a Tunnel", async () => {
                const fakeReq = getFakeReq({
                    apiKey: serviceKey,
                    apiID: serviceData.id,
                    devKey: await services.service.dev.getKey("2", "test-scv-service"),
                    route: "/test-tunnel-route",
                    service_rights: [rightsIds.admin, rightsIds.dev]
                });

                const res = getFakeRes();

                const r = await nass.tunnel.create(fakeReq, res);
                const result = r.data;
                expect(result.success).toBe(true);
                expect(result.message).toBe("Tunnel created successfully.");
            });

            test("Create a Tunnel with Non-Existing Right", async () => {
                const fakeReq = getFakeReq({
                    apiKey: serviceKey,
                    apiID: serviceData.id,
                    devKey: await services.service.dev.getKey("2", "test-scv-service"),
                    route: "/test-tunnel-route-2",
                    service_rights: [rightsIds.admin, "non-existing-right-id"]
                });
                const res = getFakeRes();

                const r = await nass.tunnel.create(fakeReq, res);
                const result = r.data;
                expect(result.success).toBe(false);
                expect(result.message).toBe('Right "non-existing-right-id" does not exist.');
            });

            test("Create a Tunnel that Already Exists", async () => {
                const fakeReq = getFakeReq({
                    apiKey: serviceKey,
                    apiID: serviceData.id,
                    devKey: await services.service.dev.getKey("2", "test-scv-service"),
                    route: "/test-tunnel-route",
                    service_rights: [rightsIds.admin, rightsIds.dev]
                });
                const res = getFakeRes();

                const r = await nass.tunnel.create(fakeReq, res);
                const result = r.data;
                expect(result.success).toBe(false);
                expect(result.message).toBe('A tunnel already exists for this target URL.');
            });


            test("Assign 'unknown' Right to User Fails", async () => {
                const assignRight = await services.service.rights.assign("unknown-right-id", "2", "test-scv-service");
                expect(assignRight.success).toBe(false);
                expect(assignRight.status).toBe(404);
                expect(assignRight.message).toBe("Service right not found.");
            });

            test("User Does Not Have 'no-work' Right", async () => {
                const rights = await services.service.user.getRights("2", "test-scv-service");
                const hasNoWorkRight = rights.some(r => r.id === rightsIds.noWork);
                expect(hasNoWorkRight).toBe(false);
            });

            test("Assign 'dev' Right to User", async () => {
                const assignRight = await services.service.rights.assign(rightsIds.dev, "2", "test-scv-service");
                expect(assignRight.success).toBe(true);
                expect(assignRight.status).toBe(200);
                expect(assignRight.message).toBe("Service right assigned successfully.");
            });


            test("Assign 'dev' Right to User Again (No Duplicates)", async () => {
                const assignRight = await services.service.rights.assign(rightsIds.dev, "2", "test-scv-service");
                expect(assignRight.success).toBe(true);
                expect(assignRight.status).toBe(200);
                expect(assignRight.message).toBe("User already has the specified rights.");
            });

            test("User Has 'dev' Right", async () => {
                const rights = await services.service.user.getRights("2", "test-scv-service");
                const hasDevRight = rights.some(r => r.id === rightsIds.dev);
                expect(hasDevRight).toBe(true);
            });
        });

        describe("Tunneling Rights Enforcement", () => {

            beforeAll(async () => {
                // Generate a new tunnel for admins only
                const fakeReq = getFakeReq({
                    apiKey: serviceKey,
                    apiID: serviceData.id,
                    devKey: await services.service.dev.getKey("2", "test-scv-service"),
                    route: "/test-tunnel-route-admin-only",
                    service_rights: [rightsIds.admin]
                });

                const res = getFakeRes();

                const r = await nass.tunnel.create(fakeReq, res);
                const result = r.data;
                expect(result.success).toBe(true);
                expect(result.message).toBe("Tunnel created successfully.");
            })


            test("Rights Valid for Tunnel", async () => {
                const ucr = fakeUCR();
                ucr.user.session_id = newSessionID;
                ucr.client = serviceUCRData;

                delete ucr.user.password;
                delete ucr.user.identifier;
                ucr.request.url = "/test-tunnel-route";

                const result = await checkTokenRights(ucr);
                expect(result.success).toBe(true);
                expect(result.status).toBe(200);
                expect(result.message).toBe("Token rights checked successfully.");
            });

            test("Rights Invalid for Tunnel", async () => {
                const ucr = fakeUCR();
                ucr.user.session_id = newSessionID;
                ucr.client = serviceUCRData;

                delete ucr.user.password;
                delete ucr.user.identifier;
                ucr.request.url = "/test-tunnel-route-admin-only";

                const result = await checkTokenRights(ucr);
                expect(result.success).toBe(false);
                expect(result.status).toBe(403);
                expect(result.message).toBe("User does not have the required rights for this tunneling route.");
            });

            test("Rights Valid for Admin Tunnel after Assigning Admin Right", async () => {
                const assignRight = await services.service.rights.assign(rightsIds.admin, "2", "test-scv-service");
                expect(assignRight.success).toBe(true);
                expect(assignRight.status).toBe(200);
                expect(assignRight.message).toBe("Service right assigned successfully.");

                const ucr = fakeUCR();
                ucr.user.session_id = newSessionID;
                ucr.client = serviceUCRData;

                delete ucr.user.password;
                delete ucr.user.identifier;
                ucr.request.url = "/test-tunnel-route-admin-only";

                const result = await checkTokenRights(ucr);
                expect(result.success).toBe(true);
                expect(result.status).toBe(200);
                expect(result.message).toBe("Token rights checked successfully.");
            });

            test("Rights Invalid for Non-Existing Tunnel", async () => {
                const ucr = fakeUCR();
                ucr.user.session_id = newSessionID;
                ucr.client = serviceUCRData;
                delete ucr.user.password;
                delete ucr.user.identifier;
                ucr.request.url = "/non-existing-tunnel-route";

                const result = await checkTokenRights(ucr);
                expect(result.success).toBe(false);
                expect(result.status).toBe(404);
                expect(result.message).toBe("No tunneling route found for this service and route.");
            });

            test("Unknown user cannot have rights checked", async () => {
                const ucr = fakeUCR();
                ucr.user.session_id = newSessionID;
                ucr.user.user_id = "unknown-user-id";
                ucr.client = serviceUCRData;
                ucr.request.url = "/test-tunnel-route";

                delete ucr.user.password;
                delete ucr.user.identifier;

                const result = await checkTokenRights(ucr);
                expect(result.success).toBe(false);
                expect(result.status).toBe(404);
                expect(result.message).toBe("User not found.");
            });
        });



        describe("STV Middleware", () => {

            beforeAll(async () => {
                // Reset any session associated to the user & service
                await db.collection("sessions").deleteMany({ service: serviceData.id });
            })

            let ssvRT: ReplyType = {
                success: true,
                status: 200,
                message: "SSV Process completed successfully.",
            }


            // The thing with STV is that it is called AFTER SSV, and cannot be called alone. So first we need to get SSV to fail, get the renewal token, and then call SSV again with the renewal token to get a new session created.


            let renewalToken: string = "";
            test("SSV Fails : querying session renewal token", async () => {
                const ucr = fakeUCR();
                ucr.client = serviceUCRData;
                delete ucr.user.token;
                delete ucr.user.session_id;

                const fakeReq = getFakeReq(ucr);
                const res = getFakeRes();
                const result: ReplyType = await middleware.process.ssv(fakeReq, res);
                expect(result.success).toBe(false);
                expect(result.status).toBe(401);
                expect(result.message).toBe("Session is outdated.");

                console.log("SSV Failure Data:", result.data);

                renewalToken = result.data.token;
                expect(renewalToken).toBeDefined();

                sessionID = result.data.session as any as string;
            });

            test("SSV Works : using session renewal token to create new session (code 201 for new session & token creation)", async () => {
                const ucr = fakeUCR();
                ucr.client = serviceUCRData;
                delete ucr.user.token;
                ucr.user.session_id = sessionID;
                ucr.data["session-renewal-token"] = renewalToken;

                const fakeReq = getFakeReq(ucr);
                const res = getFakeRes();
                const result: ReplyType = await middleware.process.ssv(fakeReq, res);
                expect(result.success).toBe(true);
                expect(result.status).toBe(201);
                expect(result.message).toBe("Session renewed successfully with code 201.");

                expect(result.data).toBeDefined();
                expect(result.data.session).toBeDefined();

                sessionID = (result.data.session as any);
                expect(sessionID).toBeDefined();
                // Expect sessionID to be a string
                expect(typeof sessionID).toBe("string");

                ssvRT = result;
                expect(ssvRT).toBeDefined();
            });


            test("STV Creates New Token for New Session", async () => {
                const ucr = fakeUCR();
                ucr.client = serviceUCRData;
                delete ucr.user.token;
                ucr.user.session_id = sessionID;
                ucr.request.url = "/test-tunnel-route";

                const fakeReq = getFakeReq(ucr);
                const res = getFakeRes();
                const result: ReplyType = await middleware.process.stv(fakeReq, res, ssvRT);
                expect(result.success).toBe(true);
                expect(result.status).toBe(200);
                expect(result.message).toBe("STV Process completed successfully.");

                expect(result.data).toBeDefined();
                expect(result.data.token).toBeDefined();

                newSessionToken = result.data.token;
                expect(newSessionToken).toBeDefined();

                console.log(`New correct credentials : Session ID = ${sessionID} | Session Token = ${newSessionToken}`);

            });

            test("Session succesfully verified in idle mode", async () => {
                const ucr = fakeUCR();
                ucr.client = serviceUCRData;
                ucr.user.session_id = sessionID;
                ucr.request.url = "/test-tunnel-route";
                ucr.user.token = newSessionToken;
                delete ucr.user.password;
                delete ucr.user.identifier;

                const fakeReq = getFakeReq(ucr);
                const res = getFakeRes();
                const result: ReplyType = await secure.user.hiddenLogin(fakeReq, res, true);
                expect(result.success).toBe(true);
                expect(result.status).toBe(200);
                expect(result.message).toBe("Login successful in idle mode.");
            })

            test("Session fails to verify when session expired", async () => {
                // Manually expire the session in the database
                let session = await secure.session.get(sessionID);
                expect(session).toBeDefined();
                expect(session?.id).toBe(sessionID);
                session!.expires_at = 0; // Set expiration to 1 second in the past
                await secure.session.update(sessionID, session);

                const ucr = fakeUCR();
                ucr.client = serviceUCRData;
                ucr.user.session_id = sessionID;
                ucr.request.url = "/test-tunnel-route";
                ucr.user.token = newSessionToken;
                delete ucr.user.password;
                delete ucr.user.identifier;

                const fakeReq = getFakeReq(ucr);
                const res = getFakeRes();
                const result: ReplyType = await secure.user.hiddenLogin(fakeReq, res, true);
                expect(result.success).toBe(false);
                expect(result.status).toBe(401);
                expect(result.message).toBe("Unauthorized : Invalid token or session.");
            });

            test("STV Fails with Invalid Session Token", async () => {
                const ucr = fakeUCR();
                ucr.client = serviceUCRData;
                ucr.user.session_id = sessionID;
                ucr.request.url = "/test-tunnel-route";
                ucr.user.token = "invalid-session-token-value";
                delete ucr.user.password;
                delete ucr.user.identifier;

                const fakeReq = getFakeReq(ucr);
                const res = getFakeRes();
                const result: ReplyType = await middleware.process.stv(fakeReq, res, ssvRT);
                expect(result.success).toBe(false);
                expect(result.status).toBe(401);
                expect(result.message).toBe("Invalid token or credentials provided.");
            });



            test("Session fails to verify with wrong session ID", async () => {
                const ucr = fakeUCR();
                ucr.client = serviceUCRData;
                ucr.user.session_id = "invalid-session-id-value";
                ucr.request.url = "/test-tunnel-route";
                ucr.user.token = newSessionToken;
                delete ucr.user.password;
                delete ucr.user.identifier;

                const fakeReq = getFakeReq(ucr);
                const res = getFakeRes();
                const result: ReplyType = await secure.user.hiddenLogin(fakeReq, res, true);
                expect(result.success).toBe(false);
                expect(result.status).toBe(401);
                expect(result.message).toBe("Unauthorized: Session not found.");
            });



            test("Session fails to verify with invalid token", async () => {
                const ucr = fakeUCR();
                ucr.client = serviceUCRData;
                ucr.user.session_id = sessionID;
                ucr.request.url = "/test-tunnel-route";
                ucr.user.token = "invalid-session-token-value";
                delete ucr.user.password;
                delete ucr.user.identifier;

                const fakeReq = getFakeReq(ucr);
                const res = getFakeRes();
                const result: ReplyType = await secure.user.hiddenLogin(fakeReq, res, true);
                expect(result.success).toBe(false);
                expect(result.status).toBe(401);
                expect(result.message).toBe("Unauthorized: Token does not match session.");
            });


        });
    })


    // describe("NASS Three-Layers System" , () => {
    //     test("Complete Request Cycle", async () => {
    //         const ucr = fakeUCR();

    //         expect(newSessionID).toBeDefined();
    //         expect(newSessionToken).toBeDefined();

    //         ucr.client = serviceUCRData;
    //         ucr.user.session_id = newSessionID;
    //         ucr.user.token = newSessionToken;
    //         delete ucr.user.password;
    //         delete ucr.user.identifier;
    //         ucr.request.url = "/test-tunnel-route";

    //         const fakeReq = getFakeReq(ucr);
    //         const res = getFakeRes();

    //         const result = await middleware.main(fakeReq, res, () => {
    //             return software.methods.serverReply(200,"Tunnel request processed successfully.");
    //         });

    //         expect(result.success).toBe(true);
    //         expect(result.status).toBe(200);
    //         expect(result.message).toBe("Tunnel request processed successfully.");
    //     });
    // })


});