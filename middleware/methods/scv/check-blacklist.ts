import { serve } from "../../../public/method/serve";
import { ReplyType } from "../../../types/.types/reply.type";
import { db } from "../../..";

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
            return {
                status: 403,
                message: "Your IP is blacklisted.",
                success: false
            };
        } else {
            return {
                status: 200,
                message: "IP is not blacklisted.",
                success: true
            }; // IP is not blacklisted
        }
    } else {
        return {
            status : 500,
            message: "Internal server error. Blacklist collection not found.",
            success: false
        };
    }
}