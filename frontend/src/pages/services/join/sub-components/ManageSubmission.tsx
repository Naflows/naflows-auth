import type { ServicesBodyProps } from "../../../../types/ServicesBodyProps";
import Loader from "../../../../global/components/Loader";
import type { AlertContentProps } from "../../../../types/AlertContentProps.type";
import { verifyCodeForService } from "../../../../scripts/pages/services/post/send-code";



export async function manageCodeSubsmission({
    service,
    setDisplayAlertCode
}: {
    service: ServicesBodyProps;
    setDisplayAlertCode: React.Dispatch<React.SetStateAction<AlertContentProps>>;
}) {

    // Show loading alert
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

    async function verify() {
        console.log("About to verify code for service:", service.id, "with code:", codeInput);
        const res = await verifyCodeForService(service.id, codeInput);
        console.log("Verification response:", res);

        if (res.success) {
            setDisplayAlertCode({
                status: res.status,
                message: `You have been successfully connected to ${service.name}. You will be redirected shortly.`,
                success: true,
                closeAlert: false,
                title: `Success`,
                displaySuccess: true,
            });
            setTimeout(() => {
                window.location.href = `/account/services/${service.id}`;
            }, 3000);
        } else {
            console.log("Verification failed:", res);
            setDisplayAlertCode({
                status: res.status,
                message: res.message || "An error occurred. Please try again.",
                success: false,
                closeAlert: false,
                displayCode: true,
                title: `Error`,
                displaySuccess: false,
            });
        }

        return res; // Return the response
    }
    await verify(); // Await the result of the verify function
}