import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Notification, User } from '../../../types/.types/collections.type';

const svgPerTypes = {
    "INFO": '<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#4cffc9"><path d="M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>',
    "WARNING": '<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#ff9021"><path d="M109-120q-11 0-20-5.5T75-140q-5-9-5.5-19.5T75-180l370-640q6-10 15.5-15t19.5-5q10 0 19.5 5t15.5 15l370 640q6 10 5.5 20.5T885-140q-5 9-14 14.5t-20 5.5H109Zm371-120q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm0-120q17 0 28.5-11.5T520-400v-120q0-17-11.5-28.5T480-560q-17 0-28.5 11.5T440-520v120q0 17 11.5 28.5T480-360Z"/></svg>',
    "ALERT": '<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#FF4221FF"><path d="M480-79q-16 0-30.5-6T423-102L102-423q-11-12-17-26.5T79-480q0-16 6-31t17-26l321-321q12-12 26.5-17.5T480-881q16 0 31 5.5t26 17.5l321 321q12 11 17.5 26t5.5 31q0 16-5.5 30.5T858-423L537-102q-11 11-26 17t-31 6Zm0-361q17 0 28.5-11.5T520-480v-160q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640v160q0 17 11.5 28.5T480-440Zm0 120q17 0 28.5-11.5T520-360q0-17-11.5-28.5T480-400q-17 0-28.5 11.5T440-360q0 17 11.5 28.5T480-320Z"/></svg>'
}


const customNotificationPattern = async (
    user: User,
    notification: Notification,
) => {

    const filePath = path.join(__dirname, '../../../resources/mailing/pattern/custom-notification.html');
    const val = fs.readFileSync(filePath, 'utf-8');


    return val.replace('[USER_NAME]', user.first_name + ' ' + user.last_name)
        .replace('[NOTIFICATION_SVG]', svgPerTypes[notification.type] || svgPerTypes["INFO"])
        .replace('[NOTIFICATION_DATE]', notification.created_at ? new Date(notification.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }) : '')
        .replace('[NOTIFICATION_TITLE]', notification.title)
        .replace('[NOTIFICATION_MESSAGE]', notification.message)
        .replace('[NOTIFICATION_LINK]', notification.link ? notification.link : 'https://nass.naflows.com/account')

}

export default customNotificationPattern;