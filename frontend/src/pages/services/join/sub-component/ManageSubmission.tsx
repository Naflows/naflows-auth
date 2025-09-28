import axios from "axios";
import type { AlertContentProps } from "../../../../global/error-alert/Alert";
import type { ServicesBodyProps } from "../../../../types/ServicesBodyProps";
import Loader from "../../../../global/components/Loader";



export async function manageCodeSubsmission({
    service,
    setDisplayAlertCode
}: {
    service: ServicesBodyProps;
    setDisplayAlertCode: React.Dispatch<React.SetStateAction<AlertContentProps>>;
}) {

    setDisplayAlertCode({
        status: 200,
        message: (
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                width: "100%",
            }}>
                <span className="subtitle">Validating your code...</span>
                <Loader loading={true} />
            </div>
        ),
        success: true,
        closeAlert: false,
        title: `Loading`,
        displaySuccess: false,
    })

    const codeInput = (document.querySelector('input[name="service-connection-code"]') as HTMLInputElement).value;
    const res = await axios.post(`${process.env.DUMMY_API_URL_DEV}/user/secure/service/register`, {
        serviceID: service.id,
        code: codeInput
    }, {
        withCredentials: true
    });
    console.log(res, "res");


    setDisplayAlertCode({
        status: res.data.status,
        message: res.data.status == 200 ? `You have been successfully connected to ${service.name}. You will be redirected shortly.` : res.data.message || "An error occurred. Please try again.",
        success: true,
        closeAlert: false,
        title: `Success`,
        displaySuccess: true,
    })

    if (res.data.status == 200) {
        setTimeout(() => {
            window.location.href = `/account/services/${service.id}`;
        }, 3000);
    }
}