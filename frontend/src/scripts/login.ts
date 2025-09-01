import type { AxiosError } from "axios";
import axios from "axios";



export async function manageLogin(
    setLoading: (loading: boolean) => void,
    setAlert: (alert: { code: number; message: string; closeAlert: boolean }) => void
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
            }
        );
        console.log(response);
        if (response.status !== 200) {
            setAlert({
                code: response.status,
                message:
                    response.data.error ||
                    "Something went wrong. If the issue persists, please contact support.",
                closeAlert: false,
            });
        }
    } catch (error: unknown) {
        console.error(error);
        setAlert({
            code: (error as AxiosError)?.response?.status || 500,
            message:
                ((error as AxiosError)?.response?.data as { error?: string })?.error ||
                "Something went wrong. If the issue persists, please contact support.",
            closeAlert: false,
        });
    } finally {
        setLoading(false);
    }


}