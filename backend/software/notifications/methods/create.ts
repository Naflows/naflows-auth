import { db } from "../../.."
import crypto from "crypto";
import { software } from "../../dir";
import { Notification } from "../../../types/.types/collections.type";
import secure from "../../../secure/global/dir";
import mailing from "../../mailing/dir";


export async function createNotification(
    userId : string,
    type : "INFO" | "WARNING" | "ALERT",
    data : {
        title : string,
        message : string,
        link? : string,
        associated_service? : string
    },
    sendMail : boolean = false
) {
    const notificationsCollection = db.collection('notifications');
    const newNotification : Notification = {
        id : crypto.randomUUID(),
        user_id : secure.crypt(userId),
        type,
        ...data,
        created_at : new Date().getTime(),
        read : false
    }

    const changes = await notificationsCollection.insertOne(newNotification);
    if (!changes.acknowledged) {
        return software.methods.serverReply(400, "Failed to create notification.");
    }

    if (sendMail) {
        const user = await secure.user.get(userId, false);
        if (user && user.email) {
            const mail = await mailing.send(
                'Naflows Notifications',
                user.email,
                `${data.title}`,
                (await mailing.patterns.customNotification(user, newNotification))
            )
            if (!mail.success) {
                return software.methods.serverReply(500, "Failed to send notification email.");
            }
        } else {
            return software.methods.serverReply(404, "User not found or has no email.");
        }
    }

    return software.methods.serverReply(201, "Notification created successfully.");
}