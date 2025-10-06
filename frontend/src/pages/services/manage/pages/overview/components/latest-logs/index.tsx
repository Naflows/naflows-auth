import { useEffect, useState } from "react";
import type { ServicesForUserProps } from "../../../../../../../types/ServicesForUserProps";
import { createdAtToAgo } from "../../../../../../account/sub-components/notifications/methods/createdAtToAgo";
import axios from "axios";
import getSvgPerType from "./methods/getSvg";


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
        }
    };
    created_at: number;
}

const LatestLogs = ({
    service
}: {
    service: ServicesForUserProps | null
}) => {

    const [logs, setLogs] = useState<Log[]>([]);
    const [metadatas, setMetadatas] = useState<Record<string, Log["metadata"]>>({});
    const [isError, setIsError] = useState(false);

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

    useEffect(() => {
        if (logs.length > 0) {
            for (const log of logs) {
                setMetadatas(prevMetadatas => ({
                    ...prevMetadatas,
                    [log.id]: log.metadata
                        ? Object.fromEntries(
                            Object.entries(log.metadata).filter(([key]) => key !== "userData" && key !== "user")
                        )
                        : {}
                }));
            }
        }
    }, [logs]);

    return (
        <div className="logs__container">
            <div className="logs__content">
                <table className="logs__table">
                    <thead>
                        <tr>
                            <th>Icon</th>
                            <th>User</th>
                            <th>Message</th>
                            <th>Timestamp</th>
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
                                <td className={`log__user ${log.metadata && log.metadata.userData ? "known" : "unknown"}`}>
                                    {log.metadata && log.metadata.userData ? (
                                        <>
                                            {log.metadata.userData.picture && (
                                                <img
                                                    src={log.metadata.userData.picture}
                                                    alt={`${log.metadata.userData.first_name ?? ""} ${log.metadata.userData.last_name ?? ""}`}
                                                    style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 8 }}
                                                />
                                            )}
                                            <div className="log__user__placeholder">
                                                <span className="log__user__name">
                                                    {log.metadata.userData.first_name ?? ""}{" "}
                                                    {log.metadata.userData.last_name ?? ""}
                                                </span>
                                                <span className="log__user__username">
                                                    {log.metadata.userData.username || "Unknown User"}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <span>Unknown User</span>
                                    )}
                                </td>
                                <td className="log__message">
                                    <span>{log.message}</span>
                                    <span>
                                        {metadatas[log.id] && Object.keys(metadatas[log.id] as object).length > 0
                                            ? JSON.stringify(metadatas[log.id])
                                            : "No additional metadata"}
                                    </span>
                                </td>
                                <td className="log__timestamp">{createdAtToAgo(log.created_at)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default LatestLogs;