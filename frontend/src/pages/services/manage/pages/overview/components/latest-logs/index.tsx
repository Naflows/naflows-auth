import { useEffect, useState } from "react";
import type { ServicesForUserProps } from "../../../../../../../types/ServicesForUserProps";
import { createdAtToAgo } from "../../../../../../account/sub-components/notifications/methods/createdAtToAgo";
import axios from "axios";
import getSvgPerType from "./methods/getSvg";
import Loader from "../../../../../../../global/components/Loader";
import LogUserDetails from "./components/user-details";
import FilterLogs from "./components/filter";
import type { Filters, Log } from "../../../../../../../types/Logs.type";



const LatestLogs = ({
    service
}: {
    service: ServicesForUserProps | null
}) => {

    const [logs, setLogs] = useState<Log[]>([]);
    const [totalLogs, setTotalLogs] = useState<number>(0);
    const [totalTabs, setTotalTabs] = useState<number>(0);

    const [isError, setIsError] = useState(false);
    const [hoveredLog, setHoveredLog] = useState<Log | null>(null);

    const [offset, setOffset] = useState<number>(0);

    const [filters, setFilters] = useState<Filters>({
        dateFrom: null,
        dateTo: null,
        type: null,
        level: null,
        user: null
    });

    useEffect(() => {
        async function fetchLogs() {
            setLogs([]);
            setIsError(false);
            try {
                await axios.post(`${process.env.DUMMY_API_URL_DEV}/user/secure/service/logs`, {
                    service_id: service?.id,
                    limit: 20,
                    offset: offset,
                    filters: filters 
                }, {
                    withCredentials: true
                }).then((res) => {
                    console.log("Fetched logs:", res.data);
                    setLogs(res.data.logs);
                    setTotalLogs(res.data.total);
                    setTotalTabs(res.data.tabs);
                });
            } catch (error) {
                console.error("Error fetching logs:", error);
                setIsError(true);
            }
        }

        if (service) { // <- Test only in order to avoid infinite loop
            fetchLogs();
        }
    }, [service, offset, filters]);


    return (
        <div className="logs__container">
            <FilterLogs filters={filters} setFilters={setFilters} />

            <div className="logs__directory" style={{
                display: isError ? "none" : "flex"
            }}>
                <div>
                    <span className="total__logs__count">
                        {totalLogs} log{totalLogs !== 1 ? "s" : ""} found
                    </span>
                    <div className="tabs__directory">
                        {

                            Array.from({ length: totalTabs }, (_, i) => i + 1).map((tab) => {
                                // Only display 5 tabs: current, two before and two after. If no tabs before or after, adjust accordingly
                                const currentTab = Math.floor(offset / 20) + 1;
                                if (currentTab <= 3) {
                                    if (tab > 5) return null;
                                } else if (currentTab >= totalTabs - 2) {
                                    if (tab <= totalTabs - 5) return null;
                                } else {
                                    if (tab < currentTab - 2 || tab > currentTab + 2) return null;
                                }

                                return (
                                    <div key={tab} className={`tab__directory__item ${offset === (tab - 1) * 10 ? "active" : ""}`} onClick={() => setOffset((tab - 1) * 10)}>
                                        {tab}
                                    </div>
                                )
                            })

                        }
                    </div>
                </div>
                <div>
                    <button className="primary-button" onClick={() => {

                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />
                        </svg>

                    </button>
                </div>
            </div>

            {
                logs.length === 0 && !isError && (
                    <Loader loading={true} />
                )
            }

            {
                logs.length > 0 ? (
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


                                        <td className={`log__user ${log.metadata && log.metadata.userData ? "known" : "unknown"}`} id={`log__user__${log.id}`} onMouseEnter={(el: React.MouseEvent<HTMLTableCellElement>) => {
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

                ) : ( isError && logs.length <= 0 && (
                        <div className="logs__error">
                            <p>Error loading logs. Please try again later.</p>
                            <button className="primary-button" onClick={() => {
                                setLogs([]);
                                setOffset(0);
                            }}>
                                Retry
                            </button>
                        </div>
                    )
                )
            }
        </div>
    )
};

export default LatestLogs;