import { useEffect, useState } from "react";
import type { UserBodyProps } from "../../../../../types/UserBodyProps";
import axios from "axios";
import type { FrontendNotification } from "../../../../../types/Notification.type";


export function useGetNotifications(userData: UserBodyProps | null, updateNotifications: boolean, setOnLoad : (e : boolean) => void) {
    const [notifications, setNotifications] = useState<FrontendNotification[]>([]);




    useEffect(() => {
        async function fetchNotifications() {
            axios.post(`${process.env.DUMMY_API_URL_DEV}/get-user-info/notifications`, {
                start: 0,
            }, {
                withCredentials: true
            }).then((response) => {
                if (response.status === 200) {
                    console.log("Fetched notifications:", response.data);
                    setNotifications(response.data.notifications.sort((a: FrontendNotification, b: FrontendNotification) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
                }
            }).catch((error) => {
                console.error("Failed to fetch notifications:", error);
            });
        }



        if ((userData && userData.id)) {
            setOnLoad(true);
            fetchNotifications();
            setOnLoad(false);
        } 
        
    }, [userData, updateNotifications])


    return { notifications };
}