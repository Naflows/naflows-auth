import { db } from "../../..";
import secure from "../../../secure/global/dir";
import { Notification } from "../../../types/.types/collections.type";


async function getNotifications(userId: string, limit: number = 10, offset: number = 0) {

    const notificationsCollection = db.collection('notifications');

    const notifications = await notificationsCollection.find({}).toArray();
    if (notifications) {
        const k = notifications.map(n => ({
            ...n,
            user_id: secure.verify(userId, n.user_id),
            isRead : n.read
        }));
        console.log(k);
        return k.filter(n => n.user_id && !n.isRead).slice(offset, offset + limit);
    }

    return [];
}

export { getNotifications };