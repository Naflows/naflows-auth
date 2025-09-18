import { db } from "../../..";
import { ReplyType } from "../../../types/.types/reply.type";
import { software } from "../../dir";
import crypto from "crypto";


export async function subscribeToMailingList(email: string): Promise<ReplyType> {
    console.log("Subscribing email to mailing list function called with email:", email);
    const mailings = db.collection('mailings');

    if (!mailings) {
        return software.methods.serverReply(500, "Mailings collection not found.");
    }

    const existingEntry = await mailings.findOne({ email: email });
    if (existingEntry) {
        if (existingEntry.subscribed) {
            return software.methods.serverReply(200, "Email is already subscribed to the mailing list. Thank you!");
        } else {
            await mailings.updateOne({ email: email }, { $set: { subscribed: true } });
            return software.methods.serverReply(200, "Email subscription reactivated. Welcome back!");
        }
    }

    const newEntry = {
        email: email,
        subscribed: true,
        created_at: Date.now(),
        id : crypto.randomUUID()
    };
    const ch = await mailings.insertOne(newEntry);

    if (!ch.acknowledged) {
        return software.methods.serverReply(500, "Failed to subscribe email to the mailing list. Please try again later.");
    }

    return software.methods.serverReply(201, "Email subscribed to the mailing list. You'll soon receive updates from us.");
}