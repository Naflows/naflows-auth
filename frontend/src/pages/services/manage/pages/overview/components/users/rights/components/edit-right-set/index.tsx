import type { ServicesForUserProps } from "../../../../../../../../../../types/ServicesForUserProps";
import type { ServiceRights } from "../../../../../../../../../../types/TunnelingTypes";
import { createdAtToAgo } from "../../../../../../../../../account/sub-components/notifications/methods/createdAtToAgo";
import ServiceRightsSmall from "../../../components/small-right";
import { updateRightsList } from "../../../scripts/update-rights";
import NassRightsList from "../sub-components/nass-rights-list";



const EditRightRight = ({
    fullDisplay,
    setFullDisplay,
    fullDisplayOriginal,
    setFullDisplayOriginal,
    rightChanged,
    setRightChanged,
    service,
    setLocalRights,
    serviceID
}: {
    fullDisplay: ServiceRights | null;
    setFullDisplay: React.Dispatch<React.SetStateAction<ServiceRights | null>>;
    fullDisplayOriginal: ServiceRights | null;
    setFullDisplayOriginal: React.Dispatch<React.SetStateAction<ServiceRights | null>>;
    rightChanged: boolean;
    setRightChanged: React.Dispatch<React.SetStateAction<boolean>>;
    service : ServicesForUserProps | null;
    serviceID: string;
    setLocalRights: React.Dispatch<React.SetStateAction<ServiceRights[]>>;
}) => {
    if (!service) return null;

    return (
        <div className="display__right__additional__content">
            <div className="rights__section__header">
                <h4 className="rights__section__title">
                    <span>Edit {fullDisplayOriginal?.name} Rights Set</span>
                    {
                        !fullDisplay?.deletable && (
                            <span className="info-badge warning-badge">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                                </svg>


                                <span>Default Right Set - Cannot be deleted</span>
                            </span>
                        )
                    }
                </h4>

                <div className="buttons__action__container">

                    <button className={`primary-button danger-button ${fullDisplay?.deletable ? "" : "inactive"}`} disabled={!fullDisplay?.deletable} onClick={() => {
                        // Delete right action
                        if (fullDisplay && fullDisplay.deletable) {
                            alert("Deleting right...")
                            // Call backend to delete right
                            // On success, remove right from localRights and close fullDisplay
                            // For now, just simulate deletion
                            setLocalRights(prev => prev.filter(r => r.id !== fullDisplay.id))
                            setFullDisplay(null)
                        }
                    }} style={{
                        display: fullDisplay?.deletable ? "flex" : "none"
                    }}>
                        Delete Right
                    </button>
                    <button className="secondary-button" onClick={() => {
                        setFullDisplay(null);
                        setFullDisplayOriginal(null);
                        setRightChanged(false);
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>


            <div className="sections">
                <div id="left-section" className="rights__section__body">
                    <div className="section__container">
                        <div className="section__header">
                            <h4 className="section__title">
                                Right Color
                            </h4>
                            <div className="section__subtitle">
                                Choose a color that will represent this right in the service. It will help you identify it quickly.
                            </div>
                        </div>
                        <div className="section__content">
                            <div className="colors__content">
                                {[...Array(10)].map((_, index) => {
                                    const hueValue = index * 36; // 0, 36, 72, ..., 324

                                    if (!fullDisplay) return null;

                                    return (
                                        <div
                                            key={hueValue}
                                            className={`color__circle ${parseInt(fullDisplay?.hue) === hueValue ? "selected" : ""}`}
                                            style={{ backgroundColor: `hsl(${hueValue}, 70%, 10%)`, color: `hsl(${hueValue}, 70%, 50%)`, border: `1px solid hsl(${hueValue}, 70%, 30%)` }}
                                            onClick={() => {
                                                if (fullDisplay && fullDisplayOriginal) {
                                                    // Update hue in fullDisplay
                                                    console.log("Setting hue to:", hueValue);
                                                    setFullDisplay({
                                                        ...fullDisplay,
                                                        hue: (hueValue).toString()
                                                    });
                                                    if (hueValue !== parseInt(fullDisplayOriginal?.hue)) {
                                                        setRightChanged(true);
                                                    } else {
                                                        setRightChanged(false);
                                                    }
                                                }
                                            }}
                                        >
                                            {parseInt(fullDisplay?.hue) === hueValue && (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={`white`} className="size-6">
                                                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                                                </svg>

                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            <div id="preview">
                                <ServiceRightsSmall id={fullDisplay?.id || ""} name={fullDisplay?.name || ""} hue={fullDisplay?.hue || "0"} />
                            </div>
                        </div>

                    </div>

                    <div className="section__container">
                        <div className="section__header">
                            <h4 className="section__title">
                                Right Name
                            </h4>
                            <div className="section__subtitle">
                                Edit the name of the right. This is how it will be displayed in the service.
                            </div>
                        </div>
                        <input
                            type="text"
                            className={`input__field width-100-auto`}
                            disabled={!fullDisplay?.deletable}
                            placeholder="Right name"
                            value={fullDisplay?.name}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (fullDisplay && fullDisplayOriginal) {
                                    setFullDisplay({
                                        ...fullDisplay,
                                        name: value
                                    });
                                    if (value !== fullDisplayOriginal?.name) {
                                        setRightChanged(true);
                                    } else {
                                        setRightChanged(false);
                                    }
                                }
                            }}
                        />
                    </div>



                    <div className="section__container">
                        <div className="section__header">
                            <h4 className="section__title">
                                Right Description
                            </h4>
                            <div className="section__subtitle">
                                Edit the description of the right. This will help you understand the purpose of this right in the future.
                            </div>
                        </div>
                        <textarea
                            className={`input__field width-100-auto ${fullDisplay?.deletable ? "" : "disabled"}`}
                            disabled={!fullDisplay?.deletable}
                            placeholder="Right description"
                            value={fullDisplay?.description || ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (fullDisplay && fullDisplayOriginal) {
                                    setFullDisplay({
                                        ...fullDisplay,
                                        description: value
                                    });
                                    if (value !== fullDisplayOriginal?.description) {
                                        setRightChanged(true);
                                    } else {
                                        setRightChanged(false);
                                    }
                                }
                            }}
                        />
                    </div>

                    <div className="section__container">
                        <div className="section__content col">
                            <div className="section__header">
                                <h4 className="section__title">
                                    Right Purpose
                                </h4>
                                <div className="section__subtitle">
                                    Wether this right is intended for Naflows-based services or for development and user management of your project.
                                </div>
                            </div>

                            <p>
                                {fullDisplay?.type === "SERVICE_BY_NASS" ? "This right is intended for Naflows-based services. Users with this right will have access to the service features and functionalities as defined by the service administrator." : "This right is intended for development and user management of your project. Users with this right will have access to development tools, user management features, and other functionalities necessary for maintaining and improving the project."}
                            </p>
                        </div>


                    </div>
                </div>

                <div id="section-separator">

                </div>

                <div id="right-section">
                    <div className="section__container">
                        <div className="section__header">
                            <h4 className="section__title">
                                Associated rights
                            </h4>
                            <div className="section__subtitle">
                                The associated rights are the rights that are linked to this right set. They define the permissions and access levels for users who have this right set.
                                <br />
                                {fullDisplay?.type === "SERVICE_BY_NASS" ? "As this right set is intended for Naflows-based services, the associated rights are predefined and cannot be modified here. Please refer to the NASS documentation for more details on the available rights." : "You can modify the associated rights for this right set below. Add or remove rights as necessary to align with your service's access control policies."}<br />
                                <a href="https://docs.naflows.com/naflows-auth/services/rights-management/" target="_blank" rel="noreferrer">Learn more about rights management.</a>
                            </div>
                        </div>
                        {
                            fullDisplay && (
                                fullDisplay.type === "SERVICE_BY_NASS" ? (
                                    <NassRightsList rightSetValue={
                                        fullDisplay
                                    }
                                        disabled={!fullDisplay?.deletable}
                                        setRightSetValue={(newRightSet) => {
                                            if (fullDisplay && fullDisplayOriginal && newRightSet) {
                                                setFullDisplay(newRightSet);
                                                // Check if rights changed
                                                const right = newRightSet as ServiceRights;
                                                const rightsChanged = JSON.stringify(right.rights.sort()) !== JSON.stringify(fullDisplayOriginal.rights.sort());
                                                if (rightsChanged) {
                                                    setRightChanged(true);
                                                } else {
                                                    setRightChanged(false);
                                                }
                                            }
                                        }} />
                                ) : (
                                    <div className="rights__container__form__content">
                                        <span className="rights__container__form__title">Current Rights ({fullDisplay.rights.length}/10)</span>
                                        {
                                            fullDisplay.rights.map((right, index) => (
                                                <div key={index} className="right__item">
                                                    <span>{right}</span>
                                                    <div className="button-content">
                                                        <button onClick={() => {
                                                            if (fullDisplay && fullDisplayOriginal) {
                                                                const newRights = fullDisplay.rights.filter((_, i) => i !== index);
                                                                setFullDisplay({ ...fullDisplay, rights: newRights });
                                                            }
                                                        }} className="primary-button width-100-auto" title={`Remove right ${right}`}>
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            )
                        }
                    </div>


                    <div className="section__container" style={{
                        display: fullDisplay?.type === "TUNNELING_BY_INSTANCE" && fullDisplay.tunnels && fullDisplay.tunnels.length > 0 && service?.user_authorizations["MANAGE_TUNNELS"] ? "block" : "none"
                    }}>
                        <div className="section__header">
                            <h4 className="section__title">
                                Associated Tunnels
                            </h4>
                            <div className="section__subtitle">
                                The following tunnels are associated with this right set. Users with this right set will have access to these tunnels.
                            </div>
                        </div>
                        <div className="tunnels__list">
                            {
                                fullDisplay?.tunnels?.map((tunnel, index) => {
                                    return (
                                        <div key={index} className="tunnel__item small-box">
                                            <span className="tunnel__target__url">
                                                {tunnel.target_url}
                                            </span>
                                            <div className="timespan">
                                                <span>Updated {createdAtToAgo(tunnel.updated_at)}</span>
                                            </div>
                                        </div>
                                    )

                                })
                            }
                        </div>
                    </div>
                </div>
            </div>



            <div className={`save__changes  ${rightChanged ? "active" : "inactive"}`}>
                <span>
                    You have unsaved changes.
                </span>
                <div className="buttons__container">
                    <button className="secondary-button" onClick={() => {
                        // Discard changes
                        setFullDisplay(fullDisplayOriginal);

                        setRightChanged(false);

                    }}>
                        Discard
                    </button>
                    <button id="save-changes-button" className={`primary-button`} onClick={async () => {
                        // Save changes to right
                        if (fullDisplay && fullDisplayOriginal) {

                            console.log("Saving changes to right:", fullDisplay);
                            console.log("Original right:", fullDisplayOriginal);

                            console.log("Difference check:", {
                                nameChanged: fullDisplay.name !== fullDisplayOriginal.name,
                                hueChanged: fullDisplay.hue !== fullDisplayOriginal.hue,
                                rightsChanged: JSON.stringify(fullDisplay.rights.sort()) !== JSON.stringify(fullDisplayOriginal.rights.sort())
                            });

                            await updateRightsList(serviceID, [fullDisplay], "single");
                            // On success, update localRights and close fullDisplay
                            // For now, just simulate saving
                            setLocalRights(prev => prev.map(r => r.id === fullDisplay.id ? fullDisplay : r));
                            setFullDisplay(null);
                            setFullDisplayOriginal(null);
                            setRightChanged(false);
                        }
                    }}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditRightRight;