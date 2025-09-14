import axios from "axios";

const fetchServiceData = async (id: string, setServiceData: (data : object) => void) => {
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
        if (res.data.success) {
            console.log(res.data.data.service, "service data");
            setServiceData(res.data.data.service);
        }
    } catch (error) {
        console.error("Error fetching service data:", error);
    }
};

export default fetchServiceData;