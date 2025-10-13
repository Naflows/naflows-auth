import axios from "axios";


export async function getApiKey(api_id: string): Promise<string | null> {
    const response = await axios.post(`${process.env.DUMMY_API_URL_DEV}/user/secure/service/key/get`, {
        service_id: api_id
    }, {
        withCredentials: true
    });
    console.log("API Key response:", response);
    if (response.data && response.status === 200) {
        return response.data.key;
    }

    return null;
};