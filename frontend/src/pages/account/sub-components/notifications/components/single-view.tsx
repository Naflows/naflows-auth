import { createdAtToAgo } from "../methods/createdAtToAgo";
import { notifications } from "../methods/dir";
import type { Notification } from "../types/notification.type";
import { notificationSVGPerType } from "../types/svg.type";


const NotificationSingleView = ({
    notification,
    setViewNotification,
    setUpdateNotifications
}: {
    notification: Notification,
    setViewNotification: (notification: Notification | undefined) => void,
    setUpdateNotifications: (update: boolean) => void
}) => {


    return (
        <div key={notification.id} className={`notification__item single-view ${notification.read ? 'read' : 'unread'}`}>
            <div className="notification__body" onClick={() => setViewNotification(notification)}>
                <div className="notification__item__icon">
                    {notificationSVGPerType[notification.type as keyof typeof notificationSVGPerType]}
                </div>
                <div className="notification__item__header">
                    <span className="notification__item__title">{notification.title}</span>
                    <span className="notification__item__date">{
                        createdAtToAgo(notification.created_at)
                    }</span>
                </div>
            </div>
            <div className="notification__item__read" style={{
                display: notification.read ? "none" : "block"
            }}>
                <button className="primary-button" onClick={() => {
                    notifications.setRead(notification.id, setUpdateNotifications);
                }}>
                    Mark as read
                </button>
            </div>
        </div>
    )
}

export default NotificationSingleView;