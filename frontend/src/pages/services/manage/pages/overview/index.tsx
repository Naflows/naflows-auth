import type { ServicesForUserProps } from "../../../../../types/ServicesForUserProps"
import ServiceCapacities from "../../sub-component/capacities"
import ServiceDescription from "../../sub-component/ServiceDescription"
import { SERVICE_OVERVIEW_TABS } from "./types/tabs.type"
import type { accountTabs } from "../../ManageService"
import QuickActions from "./components/quick-actions"


const ManageServiceOverview = ({
    service,
    setService,
    setTab,
    tab
}: {
    service: null | ServicesForUserProps;
    setService: (service: ServicesForUserProps) => void;
    setTab: (tab: accountTabs) => void;
    tab: accountTabs;
}) => {




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
                        <QuickActions service={service} setService={setService} />
                        <ServiceCapacities service={service} />
                    </div>
                    <div className="user__body__section">
                        <div className="service__overview__tabs">
                            {SERVICE_OVERVIEW_TABS.map((tab_) => (
                                <button
                                    key={tab_.id}
                                    className={`tab ${tab === tab_.id ? "primary-button" : "secondary-button"}`}
                                    style={{
                                        width: "100%"
                                    }}
                                    onClick={() => setTab(tab_.label.toLowerCase() as accountTabs)}
                                >
                                    {tab_.label}
                                </button>
                            ))}
                        </div>
                        <div className="service__overview__tab__content">


                        </div>
                    </div>
                </div>

                {/* <SecurityMeasures service={service} /> */}


            </div>
        </div>
    )
}

export default ManageServiceOverview;