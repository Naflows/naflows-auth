import axios, { type AxiosResponse } from "axios";

const fetchData = async (type: string): Promise<AxiosResponse> => {
    const res = await axios.get(
        `${process.env.DUMMY_API_URL_DEV}/get-user-info/${type}`,
        {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    return res;
};

export default fetchData;