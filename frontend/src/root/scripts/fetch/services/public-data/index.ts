import axios from "axios";
import type { ServicesForUserProps } from "../../../../../types/ServicesForUserProps";

const fetchPublicServiceData = async (id: string, setServiceData: (data : ServicesForUserProps | null) => void) : Promise<number | void> => {
    try {
        const res = await axios.get(
            `${process.env.DUMMY_API_URL_DEV}/get-user-info/services/${id}/service-informations`,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (res.data.success) {
            console.log(res.data.data.service, "service data");
            setServiceData(res.data.data.service);
            return void 0;
        }
    } catch (error) {
        console.error("Error fetching service data:", error);
        throw error;
    }
};

export default fetchPublicServiceData;