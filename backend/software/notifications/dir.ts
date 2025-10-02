import { createNotification } from "./methods/create";
import { getNotifications } from "./methods/get";
import { setNotificationRead } from "./methods/setRead";



const notifications = {
    create : createNotification,
    get : getNotifications,
    setRead : setNotificationRead
};

export default notifications;