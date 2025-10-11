import type { ServicesForUserProps } from "../../../../../../../types/ServicesForUserProps";
import type { ServiceOverviewTabs } from "../../types/tabs.type";



const ServiceUsers = ({
    service,
    setTab 
}: {
    service: ServicesForUserProps | null;
    setTab: (tab: ServiceOverviewTabs) => void;
}) => {


    return (
        <div>

            <div className="users__container">
                <button className="primary-button" onClick={() => {
                    setTab("rights");
                }}>
                    Manage Rights
                </button>
            </div>
        </div>
    )
}

export default ServiceUsers;