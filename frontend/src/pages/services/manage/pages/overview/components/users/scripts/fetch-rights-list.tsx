import axios from "axios";
import type { ServiceRights } from "../../../../../../../../types/TunnelingTypes";

async function fetchRights(serviceId : string, setIsLoading : (loading : boolean) => void) : Promise<{ nassRights: ServiceRights[]; instanceRights: ServiceRights[] }> {
    try {
        const response = await axios.post(`${process.env.DUMMY_API_URL_DEV}/user/secure/service/rights/get`, {
            service_id: serviceId
        }, {
            withCredentials: true
        });

        const fetchedRights: ServiceRights[] = response.data.rights;
        const nassRights = fetchedRights.filter(r => r.type === "SERVICE_BY_NASS");
        const instanceRights = fetchedRights.filter(r => r.type === "TUNNELING_BY_INSTANCE");
        console.log("Fetched rights:", { nassRights, instanceRights });
        return { nassRights, instanceRights };
    } catch (error) {
        console.error("Error fetching rights:", error);
        return { nassRights: [], instanceRights: [] };
    } finally {
        setIsLoading(false);
    }
}


export { fetchRights };