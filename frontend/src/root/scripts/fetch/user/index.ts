import { useEffect, useState } from "react";
import fetchData from "../informations";
import type { UserBodyProps } from "../../../../types/UserBodyProps";
import type { AlertContentProps } from "../../../../global/error-alert/Alert";
import type { AxiosError } from "axios";


export const FetchUserData = (
    setDisplayAlert: (value: AlertContentProps) => void
) => {

    const [userInfo, setUserInfo] = useState<UserBodyProps | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetchData("user");
                if (res.data && res.data.data && res.data.data.user) {
                    setUserInfo(res.data.data.user as UserBodyProps);
                }
            } catch (error) {
                const status = (error as AxiosError)?.response?.status || 500;
                if (status != 400 && status != 401 && status != 403) {
                    setDisplayAlert({
                        status: status,
                        message: "Failed to get user data. You might need to login again.",
                        success: false,
                        closeAlert: false,
                        customClose: {
                            text: "Go to Login",
                            action: () => { window.location.href = `/login?redirect?redirect` + window.location.href; }
                        },
                        title: "Error Fetching User Data",
                    });
                }
            }
        })();

    }, [setDisplayAlert]);

    return userInfo;
}