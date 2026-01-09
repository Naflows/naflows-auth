import { beforeAll, test, expect, describe } from "@jest/globals";
import { services } from "../../secure/services/dir";
import { fakeUCR, getFakeReq, getFakeRes } from "./utils";


// Before all, set up a new service created by user 1 and invite user 2 to join it.

const serviceId = "test-service";

beforeAll(async () => {
    const d = await services.service.register({
        name: "Test Service",
        description: "A service for testing purposes",
        ip_address: "123.456.789.000",
        dns: "test-service.local",
        id: serviceId,
        picture: "",
        banner: ""
    }, {
        rates: 100,
    }, {
        allow_public_visibility: true,
        allow_user_registration: true
    }, {
        id: 1
    }, {
        middleware: { data: { user_id: "2" } },
        body: {}
    }, getFakeRes());
    expect(d.success).toBe(true);
    expect(d.status).toBe(200);
    expect(d.message).toBe("Service registered successfully.");
    
    const service = await services.service.get(serviceId);

    // const serviceData = service.data.service;
    // serviceData.public_settings.allow_user_registration = false;
    // serviceData.approved = true;
    // serviceData.details.public.contact_email.approved = true;
    // serviceData.details.public.privacy_policy_url.approved = true;
    // serviceData.details.public.terms_of_service_url.approved = true;
});

describe("Cannot invite to service", () => {
    test("Because service is unapproved", async () => {
        const req = getFakeReq({
            middleware: { data: { user_id: "1" } },
            body: {
                service_id: serviceId,
                target_id: "3"
            }
        });

        const d = await services.service.user.invite.send("1", serviceId, "3");
        expect(d.success).toBe(false);
        expect(d.status).toBe(403);
        expect(d.message).toBe("Cannot send invitations for unapproved services.");

        // Approve public policy
        const service = await services.service.get(serviceId);

        const serviceData = service.data.service;
        serviceData.details.public.contact_email.approved = true;
        serviceData.details.public.privacy_policy_url.approved = true;
        serviceData.details.public.terms_of_service_url.approved = true;

        await services.service.global.update(serviceId, serviceData);


        // Service is not globally approved yet
        const d2 = await services.service.user.invite.send("1", serviceId, "3");
        expect(d2.success).toBe(false);
        expect(d2.status).toBe(403);
        expect(d2.message).toBe("Cannot send invitations for unapproved services.");

    });


    test("Because service allows public registration (but approved globally)", async () => {
        const service = await services.service.get(serviceId);
        const serviceData = service.data.service;
        serviceData.approved = true;
        serviceData.public_settings.allow_user_registration = true;
        await services.service.global.update(serviceId, serviceData);
        const d = await services.service.user.invite.send("1", serviceId, "3");
        expect(d.success).toBe(false);
        expect(d.status).toBe(400);
        expect(d.message).toBe("This service allows public user registration; invitations are not required.");
    });


    test("Successfully send invite after disabling public registration", async () => {
        const service = await services.service.get(serviceId);
        const serviceData = service.data.service;
        serviceData.public_settings.allow_user_registration = false;
        await services.service.global.update(serviceId, serviceData);
        const d = await services.service.user.invite.send("1", serviceId, "3");
        expect(d.success).toBe(true);
        expect(d.status).toBe(200);
        expect(d.message).toBe("Invitation sent successfully.");
    });
})