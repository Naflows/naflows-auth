import { useEffect } from "react";
import fetchServiceStatus from "../../../../../scripts/home/status/fetch-status";


export const useFetchStatus = ({
    setServiceStatus,
}: {
    setServiceStatus: (status: import("../../../../../types/ServiceStatus.type").ServiceStatus | null) => void;
}) => {
    const fetchInterval = 15; // 15 seconds


    useEffect(() => {
        const fetchStatus = () => {
            return fetchServiceStatus().then((data) => {
                setServiceStatus(data);
            });
        };

        fetchStatus(); // Initial fetch

        const intervalId = setInterval(fetchStatus, fetchInterval * 1000);

        return () => clearInterval(intervalId);
    }, [setServiceStatus]);
}