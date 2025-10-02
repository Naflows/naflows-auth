import { useGetNotifications } from "./get";
import { markNotificationAsRead } from "./markAsRead";



const notifications = {
    setRead : markNotificationAsRead,
    get : useGetNotifications
}

export { notifications };