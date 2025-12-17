import { Collection } from "mongoose";
import { db } from "../../../..";
import TwoFALog from "../../../../types/.types/twoFA.type";
import { ReplyType } from "../../../../types/.types/reply.type";
import { software } from "../../../../software/dir";


const states: TwoFALog["state"][] = [
    "REQUEST_GENERATED",
    "REQUEST_SENT",
    "REQUEST_EXPIRED",
    "REQUEST_FAILED",
    "REQUEST_COMPLETED",
    "REQUEST_FULLFILLED",
];


export async function updateTwoFALogState(log_id: string, newState: TwoFALog["state"], data : Partial<TwoFALog>): Promise<ReplyType> {
    const collection = db.collection('2fa_logs') as Collection<TwoFALog>;

    // Fetch existing log
    const existingLog = await collection.findOne({ id: log_id });
    if (!existingLog) {
        return software.methods.serverReply(404, "2FA log not found.");
    }



    // Prevent invalid state transitions
    // If the new state is the same as before, do nothing (because there might be other data to update)
    if (states.indexOf(newState) < states.indexOf(existingLog.state)) {
        return software.methods.serverReply(400, "Invalid state transition.");
    }



    // Update the log state
    const result = await collection.updateOne(
        { id: log_id },
        { $set: { state: newState, ...data } }
    );

    if (result.modifiedCount === 0) {
        return software.methods.serverReply(500, "Failed to update 2FA log state.");
    }

    return software.methods.serverReply(200, "2FA log state updated successfully.");
}