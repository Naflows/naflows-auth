import { useEffect } from "react";
import type { UserBodyProps } from "../../../types/UserBodyProps";
import fetchData from "../get-user-info";
import type { AxiosResponse } from "axios";
import { onFetchError } from "../on-fetch-error";


export const useFetchUserInfo = ({
    setUserInfo,
}: {
    // This function is a useState setter to set the user info in the component using this hook
    setUserInfo: (userInfo: UserBodyProps | undefined) => void;
}) => {
    useEffect(() => {
        // Fetch user data from the backend
        (async () => {
            try {
                const res = (await fetchData("user")) as AxiosResponse<{ user: UserBodyProps }>;
                if (res.data == null) {
                    throw new Error("No user data received from server");
                }
                setUserInfo(res.data.user as UserBodyProps);
            } catch (error) {
                onFetchError((error as Error).message);

            }
        })();
    }, []);
}