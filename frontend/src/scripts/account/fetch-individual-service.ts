import axios from "axios";

const fetchServiceData = async (id: string, setServiceData: (data : object) => void) : Promise<number | void> => {
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
        console.log(res.data);
        if (res.status === 200) {
            console.log(res.data.service, "service data");
            setServiceData(res.data.service);
            return void 0;
        }
    } catch (error) {
        console.error("Error fetching service data:", error);
        throw error;
    }
};

export default fetchServiceData;