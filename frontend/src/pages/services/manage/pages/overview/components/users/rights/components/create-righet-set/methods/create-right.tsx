import axios, { AxiosError } from "axios";
import type { ServiceRights } from "../../../../../../../../../../../types/TunnelingTypes";
import { useEffect } from "react";
import { useNotification } from "../../../../../../../../../../../global/action-information/NotificationContent";


const useCreateRight = (
    right: ServiceRights | null,
    section: number,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setSuccess: React.Dispatch<React.SetStateAction<{
        success: boolean,
        message: string,
        status: number
    }>>
) => {
    const { addNotification } = useNotification();

    const createRight = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.DUMMY_API_URL_DEV}/user/secure/service/rights/create`, {
                service_id: right?.service_id,
                name: right?.name,
                type: right?.type,
                deletable: right?.deletable,
                rights: right?.rights
            }, { withCredentials: true });
            console.log("Create right response:", response);
            if (response.status === 200) {
                console.log("Right created successfully:", response.data);
                setSuccess({
                    success: true,
                    message: "Right created successfully.",
                    status: 200
                });
                addNotification({
                    type: "info",
                    title: "Right Created",
                    description: "Right created successfully."
                });
            } else {
                console.error('Failed to create right:', response.data);
                setSuccess({
                    success: false,
                    message: response.data.message || "Failed to create right.",
                    status: response.data.status || 400
                });
                addNotification({
                    type: "error",
                    title: "Failed to Create Right",
                    description: response.data.message || "Failed to create right."
                });
            }
        } catch (error) {
            console.error('Error creating right:', error);
            let errorMessage = "Error creating right.";
            const axiosError = error as AxiosError;
            if (
                axiosError.response &&
                axiosError.response.data &&
                typeof axiosError.response.data === "object" &&
                "message" in axiosError.response.data
            ) {
                errorMessage = (axiosError.response.data as { message?: string }).message || errorMessage;
            }
            setSuccess({
                success: false,
                message: errorMessage,
                status: 500
            });
            addNotification({
                type: "error",
                title: "Error Creating Right",
                description: errorMessage
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (section === 3 && right) {
            console.log("Creating right:", right);
            createRight();
        }
    }, [section, right]);
};

export default useCreateRight;