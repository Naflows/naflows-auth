import type { ServicesForUserProps } from "../../../../../types/ServicesForUserProps"
import ServiceCapacities from "../../sub-component/capacities"
import ServiceDescription from "../../sub-component/ServiceDescription"
import { useEffect, useState } from "react"
import { SERVICE_OVERVIEW_TABS, type ServiceOverviewTabs } from "./types/tabs.type"
import ServiceSettings from "./components/settings"
import QuickActions from "./components/quick-actions"
import LatestLogs from "./components/latest-logs"


const ManageServiceOverview = ({
    service,
}: {
    service: null | ServicesForUserProps
}) => {

    const [serviceTabs, setServiceTabs] = useState<ServiceOverviewTabs>("settings");

    useEffect(() => {
        // Set URL params
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("tab", serviceTabs);
        window.history.replaceState({}, "", `${window.location.pathname}?${urlParams}`);
    }, [serviceTabs])

    return (
        <div className="manage__service__body">
            <div
                className="parent__of__section row__layout service__manage__content"
                style={{
                    width: "100%"
                }}
            >

                <div className="parent__of__section row__layout" id="left-side">
                    <ServiceDescription service={service} />

                </div>

                <div className="parent__of__section row__layout" id="right-side">
                    <div className="right__side__header">
                        <LatestLogs service={service} />
                        <QuickActions service={service} />
                        <ServiceCapacities service={service} />
                    </div>
                    <div className="user__body__section">
                        <div className="service__overview__tabs">
                            {SERVICE_OVERVIEW_TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    className={`tab ${serviceTabs === tab.id ? "primary-button" : "secondary-button"}`}
                                    onClick={() => setServiceTabs(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        <div className="service__overview__tab__content">
                            {serviceTabs === "settings" && <ServiceSettings service={service} />}
                        </div>
                    </div>
                </div>

                {/* <SecurityMeasures service={service} /> */}


            </div>
        </div>
    )
}

export default ManageServiceOverview;