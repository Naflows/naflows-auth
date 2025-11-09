import { useEffect, useState } from "react";
import type { ServiceRights } from "../../../../../../../../types/TunnelingTypes";
import Loader from "../../../../../../../../global/components/Loader";
import ServiceRightsComponent from "./components/rights";
import type { ServicesForUserProps } from "../../../../../../../../types/ServicesForUserProps";
import '../../../../../../../../../public/root/pages/services/manage/sub-components/Rights.scss';
import CreateRightSet from "./components/create-righet-set/create-right-set";
import { fetchRights } from "../scripts/fetch-rights-list";


const ServiceRightsComponentGlobal = ({
    service
}: {
    service: ServicesForUserProps | null
}) => {

    const [nassRights, setNassRights] = useState<ServiceRights[]>([]);
    const [instanceRights, setInstanceRights] = useState<ServiceRights[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [createRightSet, setCreateRightSet] = useState<boolean>(false);
    const [loadServices, setLoadServices] = useState<boolean>(true);

    useEffect(() => {
        if (loadServices && service) {
            fetchRights(service.id, setIsLoading).then(({ nassRights, instanceRights }) => {
                setNassRights(nassRights);
                setInstanceRights(instanceRights);
            });
            setLoadServices(false);
        }
    }, [service, loadServices]);

    if (!service) return <></>;

    return (
        <div>
            <CreateRightSet service={service} createRightSet={createRightSet} setCreateRightSet={setCreateRightSet} setLoadServices={setLoadServices} />

            <div className="users__container">
                {
                    isLoading ? (
                        <Loader loading={true} />
                    ) :
                        <>
                            <button className="primary-button width-fit" onClick={() => {
                                setCreateRightSet(true);
                            }}>Create New Rights Set</button>
                            <div className="content__container">

                                <div className="rights__container">
                                    <div className="rights__container__header">
                                        <div className="header__content">
                                            <h3 className="rights__container__title">Service Rights Sets</h3>
                                        </div>
                                    </div>
                                    <div className="rights__content">
                                        {nassRights.length === 0 ? (
                                            <p>No NASS rights sets found for this service.</p>
                                        ) : (
                                            <ServiceRightsComponent rights={nassRights} service={service}  />
                                        )}
                                    </div>
                                </div>
                                <div className="rights__container">
                                    <div className="rights__container__header">
                                        <div className="header__content">
                                            <h3 className="rights__container__title">Instance Rights Sets</h3>
                                        </div>
                                    </div>
                                    <div className="rights__content">
                                        {instanceRights.length === 0 ? (
                                            <p>No Instance rights sets found for this service.</p>
                                        ) : (
                                            <ServiceRightsComponent rights={instanceRights} service={service} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                }
            </div>
        </div>
    )
}

export default ServiceRightsComponentGlobal;