import axios from "axios";


export async function getCreationId(): Promise<string | null> {
    try {
        const res = await axios.get(`${process.env.DUMMY_API_URL_DEV}/public/generate-api-id`);
        console.log("Generated Service ID:", res.data);
        return res.data.data.key;
    } catch (error) {
        console.error("Error fetching service ID:", error);
    }
    return null;
}