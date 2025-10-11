import { useEffect, useState } from "react";
import axios from "axios";
import type { ServiceRights } from "../../../../../../../../types/TunnelingTypes";
import Loader from "../../../../../../../../global/components/Loader";
import ServiceRightsComponent from "./components/rights";
import type { ServicesForUserProps } from "../../../../../../../../types/ServicesForUserProps";
import '../../../../../../../../../public/root/pages/services/manage/sub-components/Rights.scss';
import CreateRightSet from "./components/create-righet-set/create-right-set";


const ServiceRightsComponentGlobal = ({
    service
}: {
    service: ServicesForUserProps | null
}) => {

    const [nassRights, setNassRights] = useState<ServiceRights[]>([]);
    const [instanceRights, setInstanceRights] = useState<ServiceRights[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [createRightSet, setCreateRightSet] = useState<boolean>(false);

    useEffect(() => {
        async function fetchRights() {
            if (!service) return;
            try {
                await axios.post(`${process.env.DUMMY_API_URL_DEV}/user/secure/service/rights/get`, {
                    service_id: service.id
                }, {
                    withCredentials: true
                }).then((response) => {
                    console.log("Fetched rights:", response.data.data);
                    const fetchedRights: ServiceRights[] = response.data.data.rights;
                    const nassRights = fetchedRights.filter(r => r.type === "SERVICE_BY_NASS");
                    const instanceRights = fetchedRights.filter(r => r.type === "TUNNELING_BY_INSTANCE");
                    setNassRights(nassRights);
                    setInstanceRights(instanceRights);
                }).finally(() => {
                    setIsLoading(false);
                });
            } catch (error) {
                console.error("Error fetching rights:", error);
            }
        }

        fetchRights();
    }, [service])

    if (!service) return <></>;

    return (
        <div>
            <CreateRightSet service={service} createRightSet={createRightSet} setCreateRightSet={setCreateRightSet} />

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