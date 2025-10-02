import { db } from "../../..";

async function setNotificationRead(userId: string, notificationId: string) {
    const notificationsCollection = db.collection('notifications');
    const result = await notificationsCollection.updateOne(
        { id: notificationId },
        { $set: { read: true, read_at: new Date() } }
    );
}
export { setNotificationRead };