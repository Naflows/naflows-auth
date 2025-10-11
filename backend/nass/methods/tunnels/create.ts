import { Request, Response } from "express";
import nass from "../../dir";

export async function createTunnel(req : Request, res : Response) {
    const { apiKey, apiID, devKey,  } = req.body;

    const correctData = await nass.connection.checkIncomingMetadata(apiKey, apiID, devKey, ["DEV_TOKEN_CREATION"]);


}