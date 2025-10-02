import axios from "axios"



const markNotificationAsRead = async (notificationId: string, setUpdateNotifications: (update: boolean) => void) => {
    try {
        await axios.post(`${process.env.DUMMY_API_URL_DEV}/set-user-info/notifications/mark-as-read`, {
            notificationId: notificationId
        }, {
            withCredentials: true
        }).then((response) => {
            if (response.data.status === 200) {
                console.log("Notification marked as read:", response.data);
                setUpdateNotifications(true);
            }
        }).catch((error) => {
            console.error("Failed to mark notification as read:", error);
        });
    } catch (error) {
        console.error("Error marking notification as read:", error);
    }
}

export { markNotificationAsRead };