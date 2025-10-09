import type { ServicesForUserProps } from "../../../../../../../types/ServicesForUserProps";
import '../../../../../../../../public/root/pages/services/manage/sub-components/Network.scss';
import ServiceNetworkIdentity from "./components/identity";

const ServiceNetwork = ({
    service
}: {
    service: ServicesForUserProps | null;
}) => {
    return (
        <div className="service__network__component">
            <ServiceNetworkIdentity service={service} />
            <div id="right">
                <div className="service__actions__field__header">
                    <h3 className="service__actions__field__title">Traffic</h3>
                    <p className="service__actions__field__description">Monitor the network traffic of your service to ensure optimal performance and security.</p>
                </div>
                <div className="network__traffic__placeholder">
                    <p>Network traffic monitoring coming soon</p>
                </div>
            </div>
        </div>
    )
}

export default ServiceNetwork;