import axios from "axios";
import type { AlertContentProps } from "../../../../global/error-alert/Alert";
import GlobalLoader from "../../../../root/components/global-loader";
import type { CodeSubmissionDetails } from "./types/code-submission-details.type";



export async function manageCodeSubmission({
    submissionDetails,
    setDisplayAlertCode
}: {
    submissionDetails: CodeSubmissionDetails;
    setDisplayAlertCode: React.Dispatch<React.SetStateAction<AlertContentProps>>;
}) {

    setDisplayAlertCode({
        status: 200,
        message: (
            <GlobalLoader loading={true} content={<span> Verifying code... </span>} />
        ),
        success: true,
        closeAlert: false,
        title: `Loading`,
        displaySuccess: false,
    })



    const codeInput = (document.querySelector(`input[name="${submissionDetails.inputLabel}"]`) as HTMLInputElement).value;
    if (!codeInput || codeInput.length != 6) {
        setDisplayAlertCode({
            status: 400,
            message: "Invalid code. Please enter a 6-digit code.",
            success: false,
            closeAlert: false,
            title: `Error`,
            displaySuccess: false,
        })
        return;
    }

    submissionDetails.data.code = codeInput;

    const res = await axios.post(`${process.env.DUMMY_API_URL_DEV}${submissionDetails.route}`, submissionDetails.data, {
        withCredentials: true
    });


    setDisplayAlertCode({
        status: res.data.status,
        message: res.data.status == 200 ? submissionDetails.valueOnSuccess : res.data.message || "An error occurred. Please try again.",
        success: true,
        closeAlert: false,
        title: `Success`,
        displaySuccess: true,
    })

    if (res.data.status == 200) {
        setTimeout(() => {
            window.location.href = submissionDetails.redirectOnSuccess || window.location.href;
        }, 3000);

    }
}