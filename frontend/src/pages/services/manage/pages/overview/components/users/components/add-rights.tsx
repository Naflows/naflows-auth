import { useEffect, useState } from "react";
import type { ServiceRights } from "../../../../../../../../types/TunnelingTypes";
import type { ServicesForUserProps, ServiceUser } from "../../../../../../../../types/ServicesForUserProps";
import { fetchRights } from "../scripts/fetch-rights-list";
import SmallRight from "./small-right";
import Loader from "../../../../../../../../global/components/Loader";
import RightItemCheck from "./right-item-check";

const AddUserRight = ({
    service,
    type,
    currentRights
}: {
    service: ServicesForUserProps | null,
    type: "SERVICE_BY_NASS" | "SERVICE_BY_INSTANCE",
    currentRights: ServiceUser["rights"]
}) => {
    const [loadServices, setLoadServices] = useState<boolean>(true);
    const [load, setLoad] = useState<boolean>(true);

    const [filtered, setFiltered] = useState<ServiceRights[]>([]);

    const [original, setOriginal] = useState<ServiceRights[]>([]);

    const [current, setCurrent] = useState<ServiceUser["rights"]>(currentRights);

    const [changed, setChanged] = useState<boolean>(false);

    useEffect(() => {
        if (loadServices && service) {
            fetchRights(service.id, setLoad).then(({ nassRights, instanceRights }) => {
                if (type === "SERVICE_BY_NASS") {
                    setOriginal(nassRights);
                    setFiltered(nassRights.filter((n) => !currentRights.some(cr => cr.id === n.id)));

                    // Filter current based on type
                    setCurrent(currentRights.filter((cr) => nassRights.some(n => n.id === cr.id)));
                } else {
                    setOriginal(instanceRights);
                    setFiltered(instanceRights.filter((n) => !currentRights.some(cr => cr.id === n.id)));
                    // Filter current based on type
                    setCurrent(currentRights.filter((cr) => instanceRights.some(n => n.id === cr.id)));

                }
            });
            setLoadServices(false);
        }
    }, [service, loadServices, currentRights, type]);


    useEffect(() => {
        // Check if current rights differ from initial rights
        const currentIds = current.map(r => r.id).sort();
        const originalIds = currentRights.map(r => r.id).sort();
        const isChanged = JSON.stringify(currentIds) !== JSON.stringify(originalIds);
        setChanged(isChanged);
    }, [current, filtered]);

    return (
        <div className="add-rights__container">
            <div className="add-rights__content">
                <div className="rights__section">
                    <h4 className="rights__section__title">
                        {type === "SERVICE_BY_NASS" ? "NASS Rights" : "Instance Rights"}
                    </h4>

                    {load && (
                        <Loader loading={true} />
                    )}

                    {!load && origin.length === 0 ? (
                        <p className="no-rights__message">
                            <span style={{
                                display: original.length === 0 ? "block" : "none"
                            }}>
                                No {type === "SERVICE_BY_NASS" ? "NASS" : "Instance"} rights available to add.
                            </span>
                        </p>
                    ) : !load && (
                        <div className="rights__list">
                            <div className="list__content">
                                <h5>Current Rights</h5>
                                <RightItemCheck 
                                    list={current} 
                                    currentRights={current} 
                                    filtered={filtered} 
                                    setCurrentRights={setCurrent} 
                                    setFiltered={setFiltered}
                                    selected={true}
                                />
                                {current.length === 0 && (
                                    <p className="no-rights__message">
                                        No {type === "SERVICE_BY_NASS" ? "NASS" : "Instance"} rights currently assigned.
                                    </p>
                                )}
                            </div>
                            <div className="list__content">
                                <h5>Available Rights</h5>
                                <RightItemCheck 
                                    list={filtered} 
                                    currentRights={current} 
                                    filtered={filtered} 
                                    setCurrentRights={setCurrent} 
                                    setFiltered={setFiltered}
                                    selected={false}
                                />
                                {filtered.length === 0 && (
                                    <p className="no-rights__message">
                                        No additional {type === "SERVICE_BY_NASS" ? "NASS" : "Instance"} rights available to add.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <button className="primary-button width-100-auto" onClick={() => {
                    // Logic to save the current rights
                    // This could involve calling an API to update the user's rights
                }} style={{
                    display : changed ? "block" : "none"
                }}>
                    Save Rights
                </button>
            </div>
        </div>
    )
}

export default AddUserRight;