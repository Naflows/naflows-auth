import axios from "axios";
import type { ServerStatus } from "../types/server-status.type";
import { useEffect, useState } from "react";


export function FetchServerStatus() {

    const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);

    useEffect(() => {
        const fetchStatus = () => {
            axios
                .get(`${process.env.DUMMY_API_URL_DEV}/public/status-check`)
                .then((response) => {
                    if (response.status === 200) {
                        console.log("Service status fetched:", response.data);
                        setServerStatus(response.data);
                    } else {
                        setServerStatus(null);
                    }
                })
                .catch(() => {
                    setServerStatus(null);
                });
        };

        fetchStatus(); // Initial fetch

        const intervalId = setInterval(fetchStatus, 15000); // Repeat every 15s

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [setServerStatus]);

    return { serverStatus }; 
}