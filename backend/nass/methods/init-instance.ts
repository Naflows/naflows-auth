import { Request, Response } from 'express';
import { APIKey, Service, ServiceToken } from '../../types/.types/collections.type';
import { services } from '../../secure/services/dir';
import { ReplyType } from '../../types/.types/reply.type';
import { Token } from '@stripe/stripe-js';
import secure from '../../secure/global/dir';
import nass from '../dir';

export async function initInstance(req : Request, res : Response) {
    const { apiKey, apiID, devKey } = req.body;

    const correctData = await nass.connection.checkIncomingMetadata(apiKey, apiID, devKey, ["DEV_TOKEN_CREATION"]);

    if (!correctData.success) {
        return res.status(correctData.status).json(correctData);
    }

    const tokenRT : ReplyType = await services.token.new(apiID, devKey, "MANUAL");
    if (!tokenRT.success) {
        return res.status(tokenRT.status).json(tokenRT);
    }
    const token = tokenRT.data?.serviceToken as ServiceToken;

    const userRT : ReplyType = await services.service.dev.getUserByKey(devKey);
    if (!userRT.success) {
        return res.status(userRT.status).json(userRT);
    }
    const user = userRT.data?.user;

    await services.service.logs.create(apiID, `Instance initialized and token generated.`, "SYSTEM", "INFO", { user: user?.id || "SYSTEM" });

    return res.status(200).json({ success: true, message: "Service initialized successfully.", data: { 
        token: token.token,
        token_birth : token.created_at,
     } });
}