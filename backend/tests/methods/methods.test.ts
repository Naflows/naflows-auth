import { describe, test, expect, beforeAll } from "@jest/globals";
import middleware from "../../middleware/dir";
import secure from "../../secure/global/dir";
import mongoose from "mongoose";
import { fakeRes } from "./utils";




describe("Test NASS Secure Verification Methods", () => {

    const blacklistedIP = {
        ip: "111.222.333.444",
        headers: {
            'user-agent': 'jest-test-agent'
        }
    }


    test("Check Blacklist Middleware - Non-Blacklisted IP", async () => {
        const req: any = {
            ip: "123.456.789.000"
        };
        // Excluding res because it is only used to serve the blacklist page
        const result = await middleware.check.blacklist(fakeRes, req.ip);
        expect(result.success).toBe(true);
        expect(result.status).toBe(200);
        expect(result.message).toBe("IP is not blacklisted.");
    });
    test("Check Blacklist Middleware - Add BlackListed IP", async () => {
        const result = await secure.blacklist(mongoose, blacklistedIP as any, fakeRes, "Testing blacklist");
        expect(result.success).toBe(false);
        expect(result.status).toBe(403);
        expect(result.message).toBe("Your IP has been blacklisted.");
    });

    test("Check Blacklist Middleware - Blacklisted IP", async () => {
        const req: any = {
            ip: blacklistedIP.ip
        };

        const result = await middleware.check.blacklist(fakeRes, req.ip);
        expect(result.success).toBe(false);
        expect(result.status).toBe(403);
        expect(result.message).toBe("Your IP is blacklisted.");
    });

});