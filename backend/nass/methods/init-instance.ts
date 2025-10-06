import { Request, Response } from 'express';
import { APIKey, Service, ServiceToken } from '../../types/.types/collections.type';
import { services } from '../../secure/services/dir';
import { ReplyType } from '../../types/.types/reply.type';
import { Token } from '@stripe/stripe-js';

export async function initInstance(req : Request, res : Response) {
    const { apiKey, apiID } = req.body;

    if (!apiKey || !apiID) {
        return res.status(400).json({ success: false, message: "apiKey and apiID are required." });
    }

    const serviceRT : ReplyType = await services.service.get(apiID);
    if (!serviceRT.success) {
        return res.status(404).json({ success: false, message: "Service not found." });
    }

    const keyRT : ReplyType = await services.service.key.getByApi(apiID);
    if (!keyRT.success) {
        return res.status(404).json({ success: false, message: "API Key not found for this service." });
    }

    const service = serviceRT.data as Service;
    const key = keyRT.data.key as APIKey;

    if (key.key !== apiKey) {
        console.log("[initInstance] Invalid API Key provided.");
        return res.status(403).json({ success: false, message: "Invalid API Key." });
    }
    if (key.expiresAt < Date.now()) {
        console.log("[initInstance] API Key has expired.");
        return res.status(403).json({ success: false, message: "API Key has expired." });
    }



    if (service.status !== "ACTIVE") {
        console.log("[initInstance] Service is not active.");
        return res.status(403).json({ success: false, message: "Service is not active." });
    }


    const tokenRT : ReplyType = await services.token.new(apiID, "MANUAL");
    if (!tokenRT.success) {
        return res.status(tokenRT.status).json(tokenRT);
    }
    const token = tokenRT.data?.serviceToken as ServiceToken;

    

    await services.service.logs.create(apiID, `Instance initialized and token generated.`, "SYSTEM", "INFO");

    return res.status(200).json({ success: true, message: "Service initialized successfully.", data: { 
        token: token.token,
        token_birth : token.created_at,
     } });
}