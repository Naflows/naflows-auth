import axios from "axios";
import type { ServiceStatus } from "../components/Status";


export async function fetchServiceStatus(): Promise<ServiceStatus | null> {
    try {
        return await axios
            .get(`${process.env.DUMMY_API_URL_DEV}/public/status-check`)
            .then((response) => {
                if (response.status === 200) {
                    console.log("Service status fetched:", response.data);
                    return response.data;
                } else {
                    return null;
                }
            })
            .catch(() => {
                console.error("Error fetching service status");
                return null;
            });

    } catch (error) {
        console.error("Error fetching service status:", error);
        return null;
    }
}

export default fetchServiceStatus;