import Alert from "../../../../global/error-alert/Alert"
import type { AlertContentProps } from "../../../../types/AlertContentProps.type"


export const OnError = ({
    displayAlert, setDisplayAlert
}: {
    displayAlert: AlertContentProps,
    setDisplayAlert: React.Dispatch<React.SetStateAction<AlertContentProps>>,
}) => {
    return (
        <div className="nass__page__loader">
            <Alert
                alert={displayAlert}
                setAlert={setDisplayAlert}
            />
        </div>
    )
}