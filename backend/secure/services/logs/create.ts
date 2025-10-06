import { Collection } from "mongoose";
import { db } from "../../..";
import { ServiceLog } from "../../../types/.types/collections.type";
import crypto from "crypto";


export async function createServiceLogEntry(service_id : string, message : string, type : ServiceLog["type"], level : ServiceLog["level"], metadata : object = {}) {
    const logsCollection : Collection<ServiceLog> = db.collection("service_logs") as Collection<ServiceLog>;

    const newLogEntry : ServiceLog = {
        id : crypto.randomUUID(),
        service_id,
        message,
        type,
        level,
        metadata,
        created_at: new Date().getTime()
    };
    await logsCollection.insertOne(newLogEntry);
    
}