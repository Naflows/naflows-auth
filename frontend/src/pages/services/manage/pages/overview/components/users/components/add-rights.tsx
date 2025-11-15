import { useEffect, useState } from "react";
import type { ServiceRights } from "../../../../../../../../types/TunnelingTypes";
import type { ServicesForUserProps, ServiceUser } from "../../../../../../../../types/ServicesForUserProps";
import { fetchRights } from "../scripts/fetch-rights-list";
import Loader from "../../../../../../../../global/components/Loader";
import RightItemCheck from "./right-item-check";
import { postRightsList } from "../scripts/post-rights-list";

const AddUserRight = ({
    service,
    type,
    currentRights,
    setCurrentRights,
    userID,
    setClicked
}: {
    service: ServicesForUserProps | null,
    type: "SERVICE_BY_NASS" | "TUNNELING_BY_INSTANCE",
    currentRights: ServiceUser["rights"],
    userID: string,
    setCurrentRights: React.Dispatch<React.SetStateAction<ServiceUser["rights"]>>;
    setClicked: React.Dispatch<React.SetStateAction<boolean>>;
}) => {

    const [loadServices, setLoadServices] = useState<boolean>(true);
    const [load, setLoad] = useState<boolean>(true);

    const [filtered, setFiltered] = useState<ServiceRights[]>([]);

    const [original, setOriginal] = useState<ServiceUser["rights"]>(currentRights);

    const [current, setCurrent] = useState<ServiceUser["rights"]>(currentRights);

    const [changed, setChanged] = useState<boolean>(false);

    useEffect(() => {
        if (loadServices && service) {
            fetchRights(service.id, setLoad).then(({ nassRights, instanceRights }) => {
                if (type === "SERVICE_BY_NASS") {
                    setFiltered(nassRights.filter((n) => !currentRights.some(cr => cr.id === n.id)));


                    // Filter current based on type
                    setCurrent(currentRights.filter((cr) => nassRights.some(n => n.id === cr.id)));
                    setOriginal(currentRights.filter((cr) => nassRights.some(n => n.id === cr.id)));
                } else {
                    setFiltered(instanceRights.filter((n) => !currentRights.some(cr => cr.id === n.id)));
                    // Filter current based on type
                    setCurrent(currentRights.filter((cr) => instanceRights.some(n => n.id === cr.id)));
                    setOriginal(currentRights.filter((cr) => instanceRights.some(n => n.id === cr.id)));
                }
            });
            setLoadServices(false);
        }
    }, [service, loadServices, currentRights, type]);


    useEffect(() => {
        // Check if current rights differ from initial rights
        const currentIds = current.map(r => r.id).sort();
        const originalIds = original.map(r => r.id).sort();
        const isChanged = JSON.stringify(currentIds) !== JSON.stringify(originalIds);
        console.log("Current IDs:", currentIds);
        console.log("Original IDs:", originalIds);
        setChanged(isChanged);
    }, [current, filtered, original]);
    if (!service) return null;

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
                                    filtered={filtered} 
                                    setCurrentRights={setCurrent} 
                                    setFiltered={setFiltered}
                                    selected={true}
                                    setCurrentAllTypes={setCurrentRights}
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
                                    filtered={filtered} 
                                    setCurrentRights={setCurrent} 
                                    setFiltered={setFiltered}
                                    selected={false}
                                    setCurrentAllTypes={setCurrentRights}
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

                <button className="primary-button width-100-auto" onClick={async () => {
                    // Create an array of all current right IDs for both types: currentRights content with more or less depending on current
                    const IDs = [
                        ...current.map(r => r.id),
                        ...currentRights.filter(r => r.type !== type).map(r => r.id)
                    ]

                    console.log("Submitting rights IDs:", IDs);

                    await postRightsList(userID, service.id, IDs);
                    // Update original to current
                    setOriginal(
                        [...current.map(r => r),
                        ...currentRights.filter(r => r.type !== type)]
                    );
                    // Update currentRights in parent
                    setCurrentRights(
                        [...current.map(r => r),
                        ...currentRights.filter(r => r.type !== type)]
                    );
                    setChanged(false);

                    // Close popup
                    setClicked(false);
                }} style={{
                    display : changed ? "flex" : "none"
                }}>
                    Save
                </button>
            </div>
        </div>
    )
}

export default AddUserRight;