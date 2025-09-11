import type { AxiosError } from "axios";
import axios from "axios";



export async function manageLogin(
    setLoading: (loading: boolean) => void,
    setAlert: (alert: { status : number; message: string; success : boolean; closeAlert: boolean }) => void
) {
    setLoading(true);

    const customerID = document.querySelector(
        'input[name="customerID"]'
    ) as HTMLInputElement;
    const identifier = document.querySelector(
        'input[name="identifier"]'
    ) as HTMLInputElement;
    const password = document.querySelector(
        'input[name="password"]'
    ) as HTMLInputElement;

    try {
        const response = await axios.post(
            `${process.env.DUMMY_API_URL_DEV}/send-login-request`,
            {
                user_id: customerID.value,
                identifier: identifier.value,
                password: password.value,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            },
        );
        console.log(response);
        if (response.status !== 200) {
            setAlert({
                status: response.data.status,
                message:
                    response.data.message ||
                    "Something went wrong. If the issue persists, please contact support.",
                success: response.data.success,
                closeAlert: false,
            });
        } else {
            window.location.href = "/account";
        }
    } catch (error: unknown) {
        console.error(error);
        const data = (error as AxiosError).response?.data as {
            error : {
                status: number;
                message: string;
            }
        };
        setAlert({
            status: data?.error.status || 500,
            message:
                data?.error.message ||
                "Something went wrong. If the issue persists, please contact support.",
            success: false,
            closeAlert: false,
        });
    } finally {
        setLoading(false);
    }


}