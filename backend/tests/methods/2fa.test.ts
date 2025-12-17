import { twoFA } from "../../secure/2FA/dir";
import secure from "../../secure/global/dir";
import { services } from "../../secure/services/dir";
import { Service, ServiceSettings, User } from "../../types/.types/collections.type";
import { describe, beforeAll, test, expect } from '@jest/globals';
import { getFakeRes } from "./utils";

/*

    2FA Methods Tests
    The following tests cover the Two-Factor Authentication (2FA) methods, including generating 2FA requests,
    analyzing 2FA context, and checking 2FA codes. These tests ensure that the 2FA functionality works as expected
    for various scenarios, including valid and invalid requests. They try to enclose edge cases as much as possible.


*/



describe("Two-Factor Authentication (2FA) Methods", () => {
    let service: Service;
    let user: User;
    let validCryptographicToken: string;

    beforeAll(async () => {
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

        service = (await services.service.get("test-scv-service")).data.service as Service;

        user = await secure.user.get("2", false) as User;
    })

    test("Generate 2FA Request", async () => {
        const user = await secure.user.get("2", false);
        const request = await twoFA.generateRequest(user, undefined, {
            action: "TRANSFER_OWNERSHIP",
            data: {
                serviceID: service.id
            }
        });
        expect(request).toBeDefined();
        expect(request.success).toBe(true);
        expect(request.data).toHaveProperty("codeSent", false);
        expect(request.status).toBe(201);
        expect(request.message).toBe("2FA request generated successfully.");
        expect(request.data).toHaveProperty("middleware");
        expect(request.data.middleware).toHaveProperty("2fa_cryptographic_token");

        validCryptographicToken = request.data.middleware["2fa_cryptographic_token"];
    });

    describe("Analyze 2FA Context", () => {
        test("Analyze 2FA Context - Valid Token", async () => {
            const analysis = await twoFA.analysis.context(
                user, {
                action: "TRANSFER_OWNERSHIP",
                data: {
                    serviceID: service.id
                }
            }, validCryptographicToken
            );
            expect(analysis).toBeDefined();
            expect(analysis.valid).toBe(true);
            expect(analysis.existing).toBeDefined();
        });

        test("Analyze 2FA Context - Invalid Token", async () => {
            const analysis = await twoFA.analysis.context(
                user, {
                action: "TRANSFER_OWNERSHIP",
                data: {
                    serviceID: service.id
                }
            }, "invalid_token"
            );
            expect(analysis).toBeDefined();
            expect(analysis.valid).toBe(false);
            expect(analysis.reason).toBe("Invalid or expired cryptographic token for 2FA context analysis.");
        });
    })

    describe("Generate 2FA Code Failures", () => {
        test("Request 2FA Code with invalid token", async () => {
            // First, generate a new 2FA request to get a valid code
            const request = await twoFA.generateCode(user, "invalid_token", {
                action: "TRANSFER_OWNERSHIP",
                data: {
                    serviceID: service.id
                }
            });
            expect(request.success).toBe(false);
            expect(request.status).toBe(400);
            expect(request.message).toBe("No matching 2FA request found.");
        });

        test("Request 2FA Code with invalid action", async () => {
            // First, generate a new 2FA request to get a valid code
            const request = await twoFA.generateCode(user, validCryptographicToken, {
                action: "INVALID_ACTION" as any,
                data: {
                    serviceID: service.id
                }
            });
            expect(request.success).toBe(false);
            expect(request.status).toBe(400);
            expect(request.message).toBe("No matching 2FA request found.");
        });

        test("Request 2FA Code with invalid serviceID", async () => {
            // First, generate a new 2FA request to get a valid code
            const request = await twoFA.generateCode(user, validCryptographicToken, {
                action: "TRANSFER_OWNERSHIP",
                data: {
                    serviceID: "invalid-service-id"
                }
            });
            expect(request.success).toBe(false);
            expect(request.status).toBe(400);
            expect(request.message).toBe("No matching 2FA request found.");
        });
    })

    describe("Check 2FA Code Failures", () => {
        test("Generate 2FA Code Successfully", async () => {
            const request = await twoFA.generateCode(user, validCryptographicToken, {
                action: "TRANSFER_OWNERSHIP",
                data: {
                    serviceID: service.id
                }
            });
            expect(request.success).toBe(true);
            expect(request.status).toBe(200);
            expect(request.message).toBe("2FA code generated successfully.");
        });

        test("Generate 2FA Code Again (Should Fail)", async () => {
            const request = await twoFA.generateCode(user, validCryptographicToken, {
                action: "TRANSFER_OWNERSHIP",
                data: {
                    serviceID: service.id
                }
            });
            expect(request.success).toBe(false);
            expect(request.status).toBe(400);
            expect(request.message).toBe("This 2FA request has already been used.");
        });

        test("Check 2FA Code - Invalid Code x3 Attempts", async () => {
            for (let i = 0; i < 3; i++) {
                const check = await twoFA.validateRequest(user, validCryptographicToken, {
                    action: "TRANSFER_OWNERSHIP",
                    data: {
                        serviceID: service.id
                    }
                }, "00000000"); // Invalid code
                expect(check.success).toBe(false);
                expect(check.status).toBe(400);
                expect(check.message).toBe("Invalid 2FA code.");
            }
        });

        test("Check 2FA Code - Valid Code After Failures (Should Fail)", async () => {
            // Since the previous attempts exhausted the allowed tries, this should fail
            const check = await twoFA.validateRequest(user, validCryptographicToken, {
                action: "TRANSFER_OWNERSHIP",
                data: {
                    serviceID: service.id
                }
            }, "correct_code"); // Replace with the actual correct code if needed
            expect(check.success).toBe(false);
            expect(check.status).toBe(400);
            expect(check.message).toBe("Maximum number of attempts reached for this 2FA request.");
        });
    });


    describe("Check 2FA Code", () => {
        let newCryptographicToken: string;

        test("Generate New 2FA Request for Valid Code Check", async () => {
            const request = await twoFA.generateRequest(user, undefined, {
                action: "TRANSFER_OWNERSHIP",
                data: {
                    serviceID: service.id
                }
            });
            expect(request).toBeDefined();
            expect(request.success).toBe(true);
            expect(request.data).toHaveProperty("codeSent", false);
            expect(request.status).toBe(201);
            expect(request.message).toBe("2FA request generated successfully.");
            expect(request.data).toHaveProperty("middleware");
            expect(request.data.middleware).toHaveProperty("2fa_cryptographic_token");

            newCryptographicToken = request.data.middleware["2fa_cryptographic_token"];
        });

        test("Generate 2FA Code with wrong token (Should Fail)", async () => {
            const request = await twoFA.generateCode(user, "wrong_token", {
                action: "TRANSFER_OWNERSHIP",
                data: {
                    serviceID: service.id
                }
            });
            expect(request.success).toBe(false);
            expect(request.status).toBe(400);
            expect(request.message).toBe("No matching 2FA request found.");
        });

        test("Generate 2FA Code with wrong action (Should Fail)", async () => {
            const request = await twoFA.generateCode(user, newCryptographicToken, {
                action: "INVALID_ACTION" as any,
                data: {
                    serviceID: service.id
                }
            });
            expect(request.success).toBe(false);
            expect(request.status).toBe(400);
            expect(request.message).toBe("No matching 2FA request found.");
        });

        test("Generate 2FA Code with wrong serviceID (Should Fail)", async () => {
            const request = await twoFA.generateCode(user, newCryptographicToken, {
                action: "TRANSFER_OWNERSHIP",
                data: {
                    serviceID: "invalid-service-id"
                }
            });
            expect(request.success).toBe(false);
            expect(request.status).toBe(400);
            expect(request.message).toBe("No matching 2FA request found.");
        });


        let generatedCode: string;
        test("Generate 2FA Code Successfully", async () => {
            const request = await twoFA.generateCode(user, newCryptographicToken, {
                action: "TRANSFER_OWNERSHIP",
                data: {
                    serviceID: service.id
                }
            });
            expect(request.success).toBe(true);
            expect(request.status).toBe(200);
            expect(request.message).toBe("2FA code generated successfully.");
            console.log("Request result:", request);
            generatedCode = request.data.code!;
        });

        test("Check 2FA Code - Valid Code", async () => {
            const check = await twoFA.validateRequest(user, newCryptographicToken, {
                action: "TRANSFER_OWNERSHIP",
                data: {
                    serviceID: service.id
                }
            }, generatedCode);
            expect(check.success).toBe(true);
            expect(check.status).toBe(200);
            expect(check.message).toBe("2FA code validated successfully.");
        });

        test("Check 2FA Code - Reuse of Code (Should Fail)", async () => {
            const check = await twoFA.validateRequest(user, newCryptographicToken, {
                action: "TRANSFER_OWNERSHIP",
                data: {
                    serviceID: service.id
                }
            }, generatedCode);
            expect(check.success).toBe(false);
            expect(check.status).toBe(400);
            expect(check.message).toBe("This 2FA request has already been used.");
        });

        describe("Final Attemps to access status with used 2FA", () => {
            test("Check Request with invalid token (Should Fail)", async () => {
                const check = await twoFA.analysis.context(user, {
                    action: "TRANSFER_OWNERSHIP",
                    data: {
                        serviceID: service.id
                    }
                }, "invalid_token");
                expect(check.valid).toBe(false);
                expect(check.reason).toBe("Invalid or expired cryptographic token for 2FA context analysis.");
            });

            test("Check Request with invalid action (Should Fail)", async () => {
                const check = await twoFA.analysis.context(user, {
                    action: "INVALID_ACTION" as any,
                    data: {
                        serviceID: service.id
                    }
                }, newCryptographicToken);
                expect(check.valid).toBe(false);
                expect(check.reason).toBe("Invalid or expired cryptographic token for 2FA context analysis.");
            });

            test("Check Request with invalid serviceID (Should Fail)", async () => {
                const check = await twoFA.analysis.context(user, {
                    action: "TRANSFER_OWNERSHIP",
                    data: {
                        serviceID: "invalid-service-id"
                    }
                }, newCryptographicToken);
                expect(check.valid).toBe(false);
                expect(check.reason).toBe("Invalid or expired cryptographic token for 2FA context analysis.");
            });
            
            test("Check request status (Should work)", async () => {
                const check = await twoFA.analysis.context(user, {
                    action: "TRANSFER_OWNERSHIP",
                    data: {
                        serviceID: service.id
                    }
                }, newCryptographicToken);
                expect(check.valid).toBe(true);
                expect(check.existing).toBeDefined();
            });
        });
    })


});