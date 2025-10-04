import type { UserBodyProps } from "../../../../types/UserBodyProps";
import '../../../../../public/root/pages/account/notifications/index.scss';
import NotificationSingleView from "./components/single-view";
import type { Notification } from "./types/notification.type";
import { useState } from "react";
import NotificationDetailledView from "./components/detailled-view";
import { notifications } from "./methods/dir";
import Loader from "../../../../global/components/Loader";




const Notifications = ({
    userData
}: {
    userData: UserBodyProps
}) => {
    const [viewNotification, setViewNotification] = useState<Notification | undefined>(undefined);
    const [updateNotifications, setUpdateNotifications] = useState<boolean>(false);

    const [onLoad, setOnLoad] = useState(false);

    const userNotifications: Array<Notification> = notifications.get(userData, updateNotifications, setOnLoad).notifications;



    return (
        <div className={`user__body__section ${userNotifications.length === 0 ? 'empty' : ''}`} id="notifications-section">
            <div className="service__actions__field__header">
                <h3 className="service__actions__field__title">Notification</h3>
                <span>
                    Manage your notification preferences, including email and SMS alerts
                </span>
            </div>
            <div className="user__body__section__content">
                <div className="notifications__content">
                    <NotificationDetailledView viewNotification={viewNotification} setViewNotification={setViewNotification} setUpdateNotifications={setUpdateNotifications} />

                    <div className="notifications__list">
                        {
                            onLoad && <Loader loading={onLoad} />
                        }
                        {userNotifications.length === 0 && (
                            <span style={{
                                textAlign: 'center',
                                width: '100%',
                                display: 'block',
                                marginTop: '20px',
                                opacity: 0.6
                            }}>No notifications available.</span>
                        )}
                        {userNotifications.length > 0 && (
                            <>
                                {userNotifications.map((notification: Notification) => (
                                    <NotificationSingleView key={notification.id} notification={notification} setViewNotification={setViewNotification} setUpdateNotifications={setUpdateNotifications} />
                                ))
                                }
                            </>
                        )}
                    </div>
                    <button style={{
                        display: userNotifications.length === 0 ? "none" : "block"
                    }} className="primary-button see-more-button width-100-auto">
                        <span>Load more</span>
                    </button>
                </div>
            </div>
        </div>

    )
}

export default Notifications;