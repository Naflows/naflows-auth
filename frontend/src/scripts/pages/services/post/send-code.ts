import axios, { AxiosError } from "axios";


export function sendCodeToEmail(serviceId: string): Promise<{
    success: boolean;
    status: number;
    message: string;
}> {
    axios.post(`${process.env.DUMMY_API_URL_DEV}/user/secure/confirm-identity/send-code`, {
        serviceID: serviceId
    }, {
        withCredentials: true
    }).then((response) => {
        return {
            success: response.data.success,
            status: response.status,
            message: response.data.message || "Code sent successfully."
        };
    }).catch((error) => {
        return {
            success: false,
            status: error.response?.status || 500,
            message: error.response?.data?.message || "An error occurred while sending the code."
        };
    }).finally(() => {
        //
    });

    // Temporary return until the above promise is handled properly
    return Promise.resolve({
        success: true,
        status: 200,
        message: "Code sent successfully."
    });
}

export async function verifyCodeForService(serviceId: string, code: string): Promise<{
    success: boolean;
    status: number;
    message: string;
}> {
    try {
        const response = await axios.post(`${process.env.DUMMY_API_URL_DEV}/user/secure/service/register`, {
            serviceID: serviceId,
            code: code
        }, {
            withCredentials: true
        });

        console.log("Verify code response:", response.data);
        return {
            success: response.status === 200,
            status: response.status,
            message: "Code verified successfully."
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log("Verify code error:", error.response);
            const result = {
                success: false,
                status: error.response?.status || 500,
                message: error.response?.data?.message || "An error occurred while verifying the code."
            };
            console.log("About to return error result:", result);
            return result;
        } else {
            console.log("Unexpected error:", error);
            const result = {
                success: false,
                status: 500,
                message: "An unexpected error occurred while verifying the code."
            };
            console.log("About to return unexpected error result:", result);
            return result;
        }
    }
}