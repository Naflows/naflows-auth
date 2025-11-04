import { Request, Response } from "express";
import nass from "../../dir";
import { db } from "../../..";
import { Collection } from "mongoose";
import { ServiceTunneling } from "../../../types/.types/tunneling.type";
import { services } from "../../../secure/services/dir";
import { User } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";

export async function createTunnel(req: Request, res: Response) {
    const { apiKey, apiID, devKey, route, service_rights  } = req.body;

    console.log(`Creating tunnel for API ID: ${apiID}, Route: ${route}, Service Rights: ${service_rights} with API Key: ${apiKey} and Dev Key: ${devKey}`);

    const correctData = await nass.connection.checkIncomingMetadata(apiKey, apiID, devKey, ["MANAGE_TUNNELS"]);
    console.log("Correct data:", correctData);
    if (!correctData.success) {
        return res.status(403).json({
            success: false,
            message: "You do not have permission to create tunnels."
        });
    }

    const serviceTunnelingCollection = db.collection('service_tunneling') as Collection<ServiceTunneling>;
    
    // Check if a tunnel already exists for this apiID
    const existingTunnel = await serviceTunnelingCollection.findOne({ service_id: apiID, target_url: route });

    if (existingTunnel) {
        return res.status(400).json({
            success: false,
            message: "A tunnel already exists for this target URL."
        });
    }

    // Check if all rights exists, else return error via promise
    console.log("Service rights to check:", service_rights);
    const names : string[] = [];
    for (const right of service_rights) {
        // Rights must pass by their ID!
        const rightExists = await services.service.rights.get(right, apiID,"TUNNELING_BY_INSTANCE");
        if (!rightExists) {
            console.log(`Right "${right}" does not exist.`);
            return res.status(403).json({
                success: false,
                message: `Right "${right}" does not exist.`
            });
        }
        names.push(rightExists.name);
    }

    const newTunnel: ServiceTunneling = {
        id: `tunnel-${apiID}-${Date.now()}`,
        service_id: apiID,
        target_url: route,
        allowed_rights: service_rights,
        created_at: Date.now(),
        updated_at: Date.now(),
    };

    const insertResult = await serviceTunnelingCollection.insertOne(newTunnel);

    if (insertResult.acknowledged) {
        const devRT : ReplyType = await services.service.dev.getUserByKey(devKey);
        const dev = devRT.data?.user as User;

        await services.service.logs.create(apiID, `Tunnel to ${newTunnel.target_url} created for rights ${names.join(", ")}`, "SYSTEM", "INFO", { user: dev.id || "SYSTEM" });
        return res.status(201).json({
            success: true,
            message: "Tunnel created successfully."
        });
    } else {
        return res.status(500).json({
            success: false,
            message: "Failed to create tunnel."
        });
    }
}