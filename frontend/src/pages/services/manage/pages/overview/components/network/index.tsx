import type { ServicesForUserProps } from "../../../../../../../types/ServicesForUserProps";
import '../../../../../../../../public/root/pages/services/manage/sub-components/Network.scss';
import ServiceNetworkIdentity from "./components/identity";
import 'chartjs-adapter-date-fns';
import TrafficOverview from "./components/traffic";

const ServiceNetwork = ({
    service
}: {
    service: ServicesForUserProps | null;
}) => {


    return (
        <div className="service__network__component">
            <ServiceNetworkIdentity service={service} />
            <div id="right">
                <TrafficOverview service={service} />
            </div>
        </div>
    )
}

export default ServiceNetwork;