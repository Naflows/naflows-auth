import { db } from "../../..";
import secure from "../../../secure/global/dir";


async function getNotifications(userId: string, limit: number = 10, offset: number = 0) {

    const notificationsCollection = db.collection('notifications');

    const notifications = await notificationsCollection.find({});
    if (notifications) {
        const userNotifications = []
        notifications.forEach((notification) => {
            if (secure.verify(userId, notification.user_id)) {
                userNotifications.push(notification);
            }
        });
        return userNotifications.slice(offset, offset + limit);
    }

    return [];
}

export { getNotifications };