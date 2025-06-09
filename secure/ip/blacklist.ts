import { Request, Response } from 'express';
import { serve } from '../../public/method/serve';


export async function blacklistIP(mongoose, req : Request, res : Response, reason : string) {
    const ip = req.ip || req.connection.remoteAddress;
    if (!ip) {
        console.error('IP address not found');
        return res.status(400).send('IP address not found');
    }

    // Check if the IP is blacklisted
    const blacklistCollection = mongoose.connection.collection("blacklist");
    if (blacklistCollection) {
        blacklistCollection.insertOne({
            ip: ip,
            userAgent: req.headers['user-agent'] || 'unknown',
            reason: reason || 'No reason provided',
            date: new Date()
        }, (err, result) => {
            if (err) {
                console.error('Error inserting into blacklist:', err);
                return res.status(500).send('Internal server error');
            }
            console.log(`IP ${ip} has been blacklisted.`);
            serve("IP Blacklisted", "styles/blacklist.css", "blacklist.html", res, {
                "blacklist_date": new Date().toISOString(),
                "blacklist_reason": reason || "No reason provided",
            });
        })
    } else {
        console.error('Blacklist collection not found');
        return res.status(500).send('Internal server error');
    }
}