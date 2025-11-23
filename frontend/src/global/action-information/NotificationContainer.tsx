import React from 'react';
import '../../../public/root/components/NotificationContainer.scss';
import ActionInformation from './ActionInformation';
import { useNotification } from './NotificationContent';

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <ActionInformation
          key={notification.id}
          title={notification.title}
          description={notification.description}
          action1={notification.action1 || null}
          action2={notification.action2 || null}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}