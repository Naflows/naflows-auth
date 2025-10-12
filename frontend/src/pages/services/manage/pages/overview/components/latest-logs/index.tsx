import { useEffect, useState } from "react";
import type { ServicesForUserProps } from "../../../../../../../types/ServicesForUserProps";
import { createdAtToAgo } from "../../../../../../account/sub-components/notifications/methods/createdAtToAgo";
import axios from "axios";
import getSvgPerType from "./methods/getSvg";
import Loader from "../../../../../../../global/components/Loader";
import LogUserDetails from "./components/user-details";


export interface Log {
    id: string;
    service_id: string;
    message: string;
    type: "USER" | "SERVICE" | "SECURITY" | "SYSTEM" | "OTHER" | "SETTINGS" | "DEVELOPERS";
    level: "INFO" | "WARNING" | "ERROR"; // Log level
    metadata?: {
        userData?: {
            username?: string;
            picture?: string | null;
            first_name?: string | null;
            last_name?: string | null;
            rights?: { id: string; name: string; hue: string; }[];
        },
        message? : string
    };
    created_at: number;
}

const LatestLogs = ({
    service
}: {
    service: ServicesForUserProps | null
}) => {

    const [logs, setLogs] = useState<Log[]>([]);
    const [isError, setIsError] = useState(false);
    const [hoveredLog, setHoveredLog] = useState<Log | null>(null);

    useEffect(() => {
        async function fetchLogs() {
            try {
                const response = await axios.post(`${process.env.DUMMY_API_URL_DEV}/user/secure/service/logs`, {
                    service_id: service?.id,
                    limit: 20,
                    offset: 0
                }, {
                    withCredentials: true
                });
                console.log("Fetched logs:", response.data.data.logs);
                setLogs(response.data.data.logs);
            } catch (error) {
                console.error("Error fetching logs:", error);
                setIsError(true);
            }
        }

        if (service) {
            fetchLogs();
        }
    }, [service]);



    return (
        <div className="logs__container">
            {
                logs.length === 0 && !isError && (
                    <Loader loading={true} />
                )
            }
            {
                !isError && logs.length > 0 ? (
                    <div className="logs__content">
                        <div className="log__hover__content">
                            <LogUserDetails log={hoveredLog} />
                        </div>
                        <table className="logs__table">
                            <thead>
                                <tr>
                                    <th style={{
                                        width: "fit-content"
                                    }}>Icon</th>
                                    <th style={{
                                        width: "fit-content"
                                    }}>User</th>
                                    <th style={{
                                        width: "100%"
                                    }}>Message</th>
                                    <th style={{
                                        width: "fit-content"
                                    }}>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log, i) => (
                                    <tr key={log.id} className={`log__entry status--${log.level.toLowerCase()}`}
                                        style={{
                                            animationDelay: `${i * 0.05}s`
                                        }}
                                    >
                                        <td className="log__icon">
                                            {getSvgPerType(log.type)}
                                        </td>
                                        

                                        <td className={`log__user ${log.metadata && log.metadata.userData ? "known" : "unknown"}`} id={`log__user__${log.id}`} onMouseEnter={(el : React.MouseEvent<HTMLTableCellElement>) => {
                                            setHoveredLog(log);
                                            const hoverElement = document.querySelector(".log__hover__content") as HTMLDivElement;
                                            if (hoverElement) {
                                                hoverElement.style.display = "flex";
                                                const rect = el.currentTarget.getBoundingClientRect();
                                                hoverElement.style.position = "fixed";
                                                hoverElement.style.top = `${rect.top}px`;
                                                hoverElement.style.left = `${rect.right + 5}px`;
                                                hoverElement.style.zIndex = "1000";
                                            }
                                        }} onMouseLeave={() => {
                                            setHoveredLog(null);
                                        }}>
                                            {log.metadata && log.metadata.userData ? (
                                                <>
                                                    {log.metadata.userData.picture && (
                                                        <img
                                                            src={log.metadata.userData.picture}
                                                            alt={`${log.metadata.userData.first_name ?? ""} ${log.metadata.userData.last_name ?? ""}`}
                                                            style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 8 }}
                                                        />
                                                    )}

                                                </>

                                            ) : (
                                                <span>Unknown User</span>
                                            )}
                                        </td>
                                        <td className="log__message">
                                            <span>{log.message}</span>
                                            <span>
                                                {log.metadata?.message ? log.metadata.message : "No metadata"}
                                            </span>
                                        </td>
                                        <td className="log__timestamp">
                                            <span>{createdAtToAgo(log.created_at)}</span>
                                            <span>{new Date(log.created_at).toLocaleString()}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                ) : (
                    logs.length > 0 ? (
                        <div className="logs__error">
                            <p>Unable to retrieve {service?.name}{service?.name.endsWith("s") ? "'" : "'s"} logs</p>
                        </div>
                    ) : isError && (
                        <div className="logs__error">
                            <p>Error loading logs. Please try again later.</p>
                        </div>
                    )
                )
            }
        </div>
    )
};

export default LatestLogs;