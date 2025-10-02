import { db } from "../../..";
import { software } from "../../dir";

async function setNotificationRead(userId: string, notificationId: string) {
    const notificationsCollection = db.collection('notifications');
    const result = await notificationsCollection.updateOne(
        { id: notificationId },
        { $set: { read: true, read_at: new Date() } }
    );
    if (result.modifiedCount === 1) {
        return software.methods.serverReply(200, "Notification marked as read.");
    }
    return software.methods.serverReply(400, "Failed to mark notification as read.");
}
export { setNotificationRead };