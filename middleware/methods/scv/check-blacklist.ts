import { serve } from "../../../public/method/serve";
import { ReplyType } from "../../../types/.types/reply.type";
import { db } from "../../..";
import { software } from "../../../software/dir";

export async function checkBlacklist(
    res, ip
) : Promise<ReplyType> {
    const blacklistCollection = db.collection("blacklist");
    if (blacklistCollection) {
        const blacklistedIP: any | null = await blacklistCollection.findOne({
            ip: ip
        });
        if (
            blacklistedIP && 
            process.env.NASS_BLACKLIST_ENABLED === "true"
        ) {
            serve("IP Blacklisted", "blacklist.css", "blacklist.html", res, {
                "blacklist_date": blacklistedIP.date.toISOString(),
                "blacklist_reason": blacklistedIP.reason
            });
            return software.methods.serverReply(403,"Your IP is blacklisted.")

        } else {
            return software.methods.serverReply(200, "IP is not blacklisted.");
        }
    } else {
        return software.methods.serverReply(500, "Internal server error. Blacklist collection not found.");
    }
}