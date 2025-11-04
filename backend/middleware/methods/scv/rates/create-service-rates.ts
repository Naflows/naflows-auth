import { Collection } from "mongoose";
import { db } from "../../../..";
import { Requests, Service, UserRequest } from "../../../../types/.types/collections.type";
import { ReplyType } from "../../../../types/.types/reply.type";
import { software } from "../../../../software/dir";
import crypto from "crypto";

async function createRateRecordForService(service: Service, firstRequest : UserRequest | null): Promise<ReplyType> {
    const ratesCollection = db.collection("requests") as Collection<Requests>;
    if (ratesCollection) {
        const existingRate = await ratesCollection.findOne({ associated_service: service.id });
        if (existingRate) {
            return software.methods.serverReply(409, "Rate record already exists for this service.");
        }
        const insertResult = await ratesCollection.insertOne({
            associated_service: service.id,
            id : crypto.randomUUID(),
            requests: firstRequest ? [firstRequest] : []
        });
        if (insertResult.acknowledged) {
            return software.methods.serverReply(201, "Rate record created successfully for the service.");
        } else {
            return software.methods.serverReply(500, "Failed to create rate record.");
        }
    } else {
        return software.methods.serverReply(500, "Internal server error. Requests collection not found.");
    }

}

export default createRateRecordForService;