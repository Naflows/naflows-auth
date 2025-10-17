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
            <h2>Users for {service?.name}</h2>
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