import { useEffect, useState } from "react";
import type { ServicesForUserProps } from "../../../../../../../types/ServicesForUserProps"
import axios from "axios";
import type { ServiceRights } from "../../../../../../../types/TunnelingTypes";
import '../../../../../../../../public/root/pages/services/manage/sub-components/Rights.scss';
import Loader from "../../../../../../../global/components/Loader";
import ServiceRightsComponent from "./components/rights";



const ServiceUsers = ({
    service
}: {
    service: ServicesForUserProps | null
}) => {

    const [rights, setRights] = useState<ServiceRights[]>([]);
    const [rightsDetailsLimit, setRightsDetailsLimit] = useState(5);
    const [isLoading, setIsLoading] = useState(true);

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
                    setRights(response.data.data.rights);
                    setIsLoading(false);
                });
            } catch (error) {
                console.error("Error fetching rights:", error);
            }
        }

        fetchRights();
    }, [service])

    return (
        <div>

            <div className="users__container">
                {
                    isLoading ? (
                        <Loader loading={true} />
                    ) :
                        <>

                            <div className="content__container">
                                <div className="rights__container">
                                    {rights.length === 0 ? (
                                        <p>No rights sets found for this service.</p>
                                    ) : (
                                        <ServiceRightsComponent rights={rights} rightsDetailsLimit={rightsDetailsLimit} />
                                    )}
                                </div>
                            </div>
                        </>
                }
            </div>
        </div>
    )
}

export default ServiceUsers;