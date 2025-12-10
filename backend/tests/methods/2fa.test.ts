import { twoFA } from "../../secure/2FA/dir";
import secure from "../../secure/global/dir";
import { services } from "../../secure/services/dir";
import { Service, ServiceSettings, User } from "../../types/.types/collections.type";
import { describe, beforeAll, test, expect } from '@jest/globals';
import { getFakeRes } from "./utils";

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
});