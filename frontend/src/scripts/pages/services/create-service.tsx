import axios from "axios";
import type { ServiceConfigurationProps } from "../../../pages/services/create/sub-components/configuration";
import type { AlertContentProps } from "../../../types/AlertContentProps.type";


export const createServiceToNass = ({
    serviceDescription,
    serviceConfiguration,
    setDisplayAlert
}: {
    serviceDescription: {
        name: string;
        description: string;
        profileImage: string;
        allow_public_visibility: boolean;
        bannerImage?: string;
        id: string;
    },
    serviceConfiguration: ServiceConfigurationProps,
    setDisplayAlert: React.Dispatch<React.SetStateAction<AlertContentProps>>;
}) => {
    const create = axios.post(`${process.env.DUMMY_API_URL_DEV}/set-user-info/services/create`, {
        details: {
            public: serviceDescription,
            configuration: {
                plans: serviceConfiguration.plans.id,
                config: serviceConfiguration.config,
                settings: serviceConfiguration.settings
            }
        }
    }, {
        headers: {
            // Also allow large image uploads
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        withCredentials: true
    });
    create.then((res) => {
        console.log(res);
        if (res.status === 200) {
            setDisplayAlert({
                status: 200,
                message: "Service created successfully! You will be redirected to the service page shortly.",
                success: true,
                closeAlert: false,
                displayCode: false,
                title: "Service Created"
            });
            setTimeout(() => {
                window.location.href = `/services/manage/${serviceDescription.id}`;
            }, 5000);
        }
    }).catch((err) => {
        setDisplayAlert({
            status: err.response?.status || 500,
            message: err.response?.data?.message || "An error occurred while creating the service.",
            success: false,
            closeAlert: false,
            displayCode: true,
            title: "Service Creation Failed"
        });
    });
}