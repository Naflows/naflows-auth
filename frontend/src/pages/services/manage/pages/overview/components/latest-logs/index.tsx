import type { ServicesForUserProps } from "../../../../../../../types/ServicesForUserProps";
import { createdAtToAgo } from "../../../../../../account/sub-components/notifications/methods/createdAtToAgo";


const logDummy = {
    id: "log_1",
    service_id: "naflows_backend",
    message: "Service started successfully.",
    level: "INFO",
    created_at: new Date().getTime() - 600000,
    metadata: {
        user_id: "1",
        ip_address: "::ffff:172.18.0.2"
    },
    type: "STATUS"
};

const LatestLogs = ({
    service
}: {
    service: ServicesForUserProps | null
}) => {
    return (
        <div className="service__activity__display user__body__section">
            <div className="service__status">
                <span className={`service__activity__status ${service?.active ? "ACTIVE" : "INACTIVE"}`}></span>
                <div className="service__status__header">
                    <span className={`service__activity__text  ${service?.status == "ACTIVE" ? "ACTIVE" : "INACTIVE"}`}>
                        {service?.status === "ACTIVE" ? "Connected to the NASS" : "Disconnected from the NASS"}
                    </span>
                </div>
            </div>
            <div className="latest_log">
                <div className={`log__entry  status--${logDummy.level.toLowerCase()}`}>
                    <span className="log__timestamp">{createdAtToAgo(logDummy.created_at)}</span>
                    <span className="log__message">{logDummy.message}</span>
                </div>
            </div>
        </div>
    )
};

export default LatestLogs;