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
                <div className="global__content">
                    <div className="parent__of__section row__layout" id="left-side">
                        <ServiceDescription service={service} />
                    </div>

                    <div className="parent__of__section row__layout" id="right-side">
                        <div className="right__side__header">
                            <QuickActions service={service} setService={setService} />
                            <ServiceCapacities service={service} />
                        </div>
                    </div>
                </div>

                {/* <SecurityMeasures service={service} /> */}


            </div>
        </div>
    )
}

export default ManageServiceOverview;