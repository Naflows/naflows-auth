import { useState } from "react";
import Alert, { type AlertContentProps } from "../../../../../../../global/error-alert/Alert";
import type { UserBodyProps } from "../../../../../../../types/UserBodyProps";
import ManageAlert from "../../../../../../services/join/sub-component/ManageAlert";
import Input from "../../../../../../../global/components/Input";




const AccountUpdateMail = ({
    userInfo
}: {
    userInfo: UserBodyProps | undefined
}) => {
    const [alert, setAlert] = useState<AlertContentProps>({
        status: 0,
        message: "",
        success: false,
        closeAlert: true,
    });


    if (userInfo) {
        return (
            <>
                <Alert alert={alert} setAlert={setAlert} />
                <button className="secondary-button" onClick={() => {
                    setAlert({
                        status: 200,
                        message: (
                            <>
                                <span className="subtitle">Please enter your new email address:</span>
                                <Input
                                    label="New Email Address"
                                    name="new-email"
                                    type="email"
                                    required={true}
                                    autoComplete={false}
                                    fitContent={false}
                                    editMode={true}
                                />
                            </>
                        ),
                        customClose: {
                            text: "Cancel",                            action: () => {
                                setAlert({ ...alert, closeAlert: true })
                            },
                            additionalButton: {
                                content: <span>Confirm</span>,
                                action: () => {
                                    // TODO: Handle email change request
                                }
                            },
                        },
                        title: "Change Email",
                        success: true,
                        closeAlert: false,
                        displaySuccess: false,

                    })
                }}>
                    <span>Change Email</span>
                </button>
            </>
        )
    }
}

export default AccountUpdateMail;