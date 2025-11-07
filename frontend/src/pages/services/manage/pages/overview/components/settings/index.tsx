import Loader from "../../../../../../../global/components/Loader";
import Switch from "../../../../../../../global/components/Switch";
import type { ServicesForUserProps } from "../../../../../../../types/ServicesForUserProps";


const ServiceSettings = ({
    service
}: {
    service: ServicesForUserProps | null
}) => {
    if (service) {
        return (
            <div className="service__tab__content user__body__section">
                <div className="tab__content__section">
                    <Switch label="Enable Service" checked={service.status != "ACTIVE"} onChange={(value) => { return value }} description="Toggle to enable or disable the service" />
                </div>
            </div>
        )
    } else {
        return (
            <div className="global__loader__container">
                <span>Loading service settings...</span>
                <Loader loading={true} />
            </div>
        )
    }
}

export default ServiceSettings;