import axios from "axios";



export async function getPublicServiceInformations(serviceId: string, userId: string | null) {
    try {
        const res = await axios.get(`${process.env.DUMMY_API_URL_DEV}/public/services/${serviceId}/infos/${userId || "null"}`);
        if (res.data) {
            console.log("Fetched service data:", res.data);
            return res.data;
        } else {
            return null;
        }
    } catch (error) {
        console.log("Error fetching service data:", error);
        return null;
    }
}