import { Request, Response } from 'express';
import { serve } from '../../../public/method/serve';
import { software } from '../../../software/dir';
import { db } from '../../..';


export async function blacklistIP(mongoose, req : Request, res : Response, reason : string) {
    const ip = req.ip || req.connection.remoteAddress;
    if (!ip) {
        console.error('IP address not found');
        return res.status(400).send('IP address not found');
    }

    // Check if the IP is blacklisted
    const blacklistCollection = db.collection("blacklist");
    if (blacklistCollection) {
        try {
            const result = await blacklistCollection.insertOne({
                ip: ip,
                userAgent: req.headers['user-agent'] || 'unknown',
                reason: reason || 'No reason provided',
                date: new Date()
            });
            console.log(`IP ${ip} has been blacklisted. insertedId=${result.insertedId}`);
            serve("IP Blacklisted", "blacklist.css", "blacklist.html", res, {
                "blacklist_date": new Date().toISOString(),
                "blacklist_reason": reason || "No reason provided",
            });
            return software.methods.serverReply(403, "Your IP has been blacklisted.");
        } catch (err) {
            console.error('Error inserting into blacklist:', err);
            return res.status(500).send('Internal server error');
        }
    } else {
        console.error('Blacklist collection not found');
        return res.status(500).send('Internal server error');
    }
}