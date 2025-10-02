import { createdAtToAgo } from "../methods/createdAtToAgo"
import { notifications } from "../methods/dir"
import type { Notification } from "../types/notification.type"
import { notificationSVGPerType } from "../types/svg.type"


const NotificationDetailledView = ({
    viewNotification,
    setViewNotification,
    setUpdateNotifications
}: {
    viewNotification: Notification | undefined,
    setViewNotification: (notification: Notification | undefined) => void,
    setUpdateNotifications: (update: boolean) => void
}) => {
    if (viewNotification != undefined) {
        return (
            <div className="notification__detailed__view">
                <div className="detailled__view__content">
                    <div className="content__body">
                        <div className="notification__detailed__view__header-container">
                            {notificationSVGPerType[viewNotification.type as keyof typeof notificationSVGPerType]}
                            <div className="notification__detailed__view__header">
                                <span className="notification__detailed__view__date">{createdAtToAgo(viewNotification.created_at)}</span>
                                <h3>{viewNotification.title}</h3>
                            </div>
                        </div>
                        <div className="notification__detailed__view__message">
                            <p dangerouslySetInnerHTML={{ __html: viewNotification.message }}></p>
                            {viewNotification.link && (
                                <a href={viewNotification.link} className="notification__detailed__view__link">
                                    {viewNotification.link}
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="buttons-container">
                        <button className="secondary-button back-button" onClick={() => setViewNotification(undefined)}>
                            <span>Back to all notifications</span>
                        </button>
                        <button className="primary-button back-button" onClick={() => {
                            notifications.setRead(viewNotification.id, setUpdateNotifications);
                            setViewNotification(undefined);
                        }}>
                            <span>Mark as read</span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default NotificationDetailledView;