import axios from "axios";
import type { AlertContentProps } from "../../../../global/error-alert/Alert";
import GlobalLoader from "../../../components/global-loader";
import type { CodeSubmissionDetails } from "../code-submission/types/code-submission-details.type";
import CodeSubmissionInput from "./components/code-input";
import { manageCodeSubmission } from "../code-submission";



export function SendCodeForSubmission(
    userEmail: string,
    setDisplayAlertCode: React.Dispatch<React.SetStateAction<AlertContentProps>>,
    displayAlertCode: AlertContentProps,
    submissionDetails: CodeSubmissionDetails
) {
    const hiddenMail = userEmail || "";
    const emailParts = hiddenMail.split("@");
    const truncatedEmail = emailParts[0].slice(0, 2) + "****@" + emailParts[1];

    setDisplayAlertCode({
        status: 200,
        message: (
            <GlobalLoader loading={true} content={<span> Sending code to <strong> {truncatedEmail} </strong></span>} />
        ),

        success: true,
        closeAlert: false,
        title: `Loading`,
        displaySuccess: false,
    })

    const res = axios.post(`${process.env.DUMMY_API_URL_DEV}/user/secure/confirm-identity/send-code`, {
        serviceID: "naflows_backend"
    }, {
        withCredentials: true
    });
    res.then(() => {
        setDisplayAlertCode({
            status: 200,
            message: <CodeSubmissionInput inputLabel="service-connection-code" truncatedEmail={truncatedEmail} />,
            success: true,
            closeAlert: false,
            title: `Confirm Your Identity`,
            displaySuccess: false,
            customClose: {
                text: "Cancel",
                action: () => { setDisplayAlertCode({ ...displayAlertCode, closeAlert: true }) },
                additionalButton: {
                    content: (
                        <>
                            <span>Submit</span>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M647-440H200q-17 0-28.5-11.5T160-480q0-17 11.5-28.5T200-520h447L451-716q-12-12-11.5-28t12.5-28q12-11 28-11.5t28 11.5l264 264q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L508-188q-11 11-27.5 11T452-188q-12-12-12-28.5t12-28.5l195-195Z" /></svg>
                        </>
                    ),
                    action: async () => {
                        await manageCodeSubmission({
                            submissionDetails,
                            setDisplayAlertCode,
                        })
                    },
                    class: "primary-button"
                }
            }
        })
    })
}

