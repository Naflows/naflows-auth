import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import type { AlertContentProps } from "../../../../../global/error-alert/Alert";
import type { ServicesBodyProps } from "../../../../../types/ServicesBodyProps";

export function FetchServiceUserData(
    serviceID: string | null,
    userID : string | null,
    setDisplayAlert: (value: AlertContentProps) => void
) {
    const [service, setService] = useState<ServicesBodyProps | null>(null);

    useEffect(() => {
        if (serviceID && userID) {
            (async () => {
                try {
                    const res = await axios.get(`${process.env.DUMMY_API_URL_DEV}/public/services/${serviceID}/infos/${userID}`);
                    if (res.data) {
                        console.log("Fetched service data:", res.data);
                        setService(res.data);
                    } else {
                        throw new Error("Failed to fetch service data");
                    }
                } catch (error) {
                    setDisplayAlert({
                        status: (error as AxiosError)?.response?.status || 500,
                        message: "Failed to fetch service data. Please try again. Make sure the service exists.",
                        success: false,
                        closeAlert: false,
                        title: "Error Fetching Service Data",
                        displayCode: true,
                    });
                }
            })();
        }
    }, [serviceID, userID, setDisplayAlert]);

    return service;

}