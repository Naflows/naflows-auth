import { useEffect, useState } from "react";
import type { ServiceRights } from "../../../../../../../../types/TunnelingTypes";
import type { ServicesForUserProps, ServiceUser } from "../../../../../../../../types/ServicesForUserProps";
import { fetchRights } from "../scripts/fetch-rights-list";
import Loader from "../../../../../../../../global/components/Loader";
import RightItemCheck from "./right-item-check";
import { postRightsList } from "../scripts/post-rights-list";
import { useNotification } from "../../../../../../../../global/action-information/NotificationContent";

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
    const { addNotification } = useNotification();

    const [loadServices, setLoadServices] = useState<boolean>(true);
    const [load, setLoad] = useState<boolean>(true);

    const [filtered, setFiltered] = useState<ServiceRights[]>([]);

    const [original, setOriginal] = useState<ServiceUser["rights"]>(currentRights);

    const [current, setCurrent] = useState<ServiceUser["rights"]>(currentRights);

    const [allRights, setAllRights] = useState<ServiceRights[]>([]);

    const [changed, setChanged] = useState<boolean>(false);

    useEffect(() => {
        if (loadServices && service) {
            fetchRights(service.id, setLoad).then(({ nassRights, instanceRights }) => {
                console.log("Fetched rights:", { nassRights, instanceRights });

                if (type === "SERVICE_BY_NASS") {
                    setFiltered(nassRights.filter((n) => !currentRights.some(cr => cr.id === n.id)));


                    // Filter current based on type
                    setCurrent(currentRights.filter((cr) => nassRights.some(n => n.id === cr.id)));
                    setOriginal(currentRights.filter((cr) => nassRights.some(n => n.id === cr.id)));
                    setAllRights(nassRights);
                } else {
                    setFiltered(instanceRights.filter((n) => !currentRights.some(cr => cr.id === n.id)));
                    // Filter current based on type
                    setCurrent(currentRights.filter((cr) => instanceRights.some(n => n.id === cr.id)));
                    setOriginal(currentRights.filter((cr) => instanceRights.some(n => n.id === cr.id)));
                    setAllRights(instanceRights);
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
                            <RightItemCheck
                                list={allRights}
                                filtered={filtered}
                                setCurrentRights={setCurrent}
                                setFiltered={setFiltered}
                                setCurrentAllTypes={setCurrentRights}
                                userRights={current}
                            />
                        </div>
                    )}
                </div>

                <button className="primary-button width-100-auto" onClick={async () => {
                    // Create an array of IDs with the following pattern: {
                    //   type : right.type,
                    //   id : right.id,
                    //   update_type : "ADD" | "REMOVE"
                    //}
                    const IDs: { type: "SERVICE_BY_NASS" | "TUNNELING_BY_INSTANCE", id: string, update_type: "ADD" | "REMOVE" }[] = [
                        ...current.map(r => ({
                            type: r.type,
                            id: r.id,
                            update_type: "ADD"
                        })),
                        ...original.filter(r => !current.some(cr => cr.id === r.id)).map(r => ({
                            type: r.type,
                            id: r.id,
                            update_type: "REMOVE"
                        }))
                    ];

                    console.log("Submitting rights IDs:", IDs);

                    await postRightsList(userID, service.id, IDs).then((response) => {
                        console.log("Post rights list response:", response);
                        if (response) {
                            const success = response.success;
                            if (success) {
                                addNotification({
                                    title: "User Rights Updated",
                                    description: "The user rights have been successfully updated.",
                                    type: "info",
                                    action1: undefined,
                                    action2: undefined,
                                });
                            } else {
                                addNotification({
                                    title: "Failed to Update Rights",
                                    description: response.message || "An error occurred while updating user rights.",
                                    type: "error",
                                    action1: undefined,
                                    action2: undefined,
                                });
                            }
                        }

                    });
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
                    display: changed ? "flex" : "none"
                }}>
                    Save
                </button>
            </div>
        </div>
    )
}

export default AddUserRight;