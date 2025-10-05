import axios from "axios";
import type { ServicesForUserProps } from "../../../../../../../../types/ServicesForUserProps";
import type { AlertContentProps } from "../../../../../../../../global/error-alert/Alert";
import Loader from "../../../../../../../../global/components/Loader";



const StartService = ({
    service,
    setService,
    setAlert
} : {
    service : ServicesForUserProps;
    setAlert : (alert : AlertContentProps) => void;
    setService : (service : ServicesForUserProps) => void;
}) => {
    const startService = async () => {
        if (!service) return;

        setAlert({
            message : (
                <Loader loading={true} />
            ),
            success: false,
            displayCode: false,
            displaySuccess: false,
            status: 0,
            closeAlert: false,
            title: "Attempting to start service..."
        })

        await axios.post(`${process.env.DUMMY_API_URL_DEV}/nass/instance/connect`, {
            serviceID: service.id,
        }, {
            withCredentials: true
        }).then((res) => {
            if (res.data.success) {
                console.log("Service started successfully:", res.data);
                setService({
                    ...service,
                    status: service.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
                });
                setAlert({
                    message : res.data.message,
                    title:  "Operation Successful",
                    success: true,
                    displayCode: false,
                    displaySuccess: true,
                    status: 200,
                    closeAlert: false
                });
            }
        }).catch((err) => {
            setAlert({
                message : err.response?.data?.message || "An error occurred while starting the service.",
                title: "Something went wrong",
                success: false,
                displayCode: false,
                displaySuccess: false,
                status: 500,
                closeAlert: false
            });
        });
    }

    startService();
};

export default StartService;