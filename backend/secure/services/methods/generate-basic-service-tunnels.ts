import { db } from "../../..";


export async function generateBasicServiceTunnels(service_id: string, owner_id: string) {
    const serviceRightsDB = db.collection('service_rights');
    const userRightsDB = db.collection('user_rights');

    // Create developers
    await serviceRightsDB.insertOne({
        id: `dev-rights-${service_id}`,
        service_id: service_id,
        rights: ["MANAGE_TUNNELS", "MANAGE_DEVS", "VIEW_STATS", "READ", "WRITE", "DELETE"],
        created_at: Date.now(),
        updated_at: Date.now(),
        deletable: false
    });

    await userRightsDB.insertOne({
        id: `dev-rights-${owner_id}-${service_id}`,
        user_id: owner_id,
        rights: ["MANAGE_TUNNELS", "MANAGE_DEVS", "VIEW_STATS", "READ", "WRITE", "DELETE"],
        created_at: Date.now(),
        updated_at: Date.now()
    });
}