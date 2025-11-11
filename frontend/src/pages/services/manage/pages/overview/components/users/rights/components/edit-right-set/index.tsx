import Input from "../../../../../../../../../../global/components/Input";
import Textarea from "../../../../../../../../../../global/components/Textarea";
import type { ServiceRights } from "../../../../../../../../../../types/TunnelingTypes";
import ServiceRightsSmall from "../../../components/small-right";



const EditRightRight = ({
    fullDisplay,
    setFullDisplay,
    fullDisplayOriginal,
    setFullDisplayOriginal,
    rightChanged,
    setRightChanged,
    rights,
    setLocalRights
}: {
    fullDisplay: ServiceRights | null;
    setFullDisplay: React.Dispatch<React.SetStateAction<ServiceRights | null>>;
    fullDisplayOriginal: ServiceRights | null;
    setFullDisplayOriginal: React.Dispatch<React.SetStateAction<ServiceRights | null>>;
    rightChanged: boolean;
    setRightChanged: React.Dispatch<React.SetStateAction<boolean>>;
    rights: ServiceRights[];
    setLocalRights: React.Dispatch<React.SetStateAction<ServiceRights[]>>;
}) => {
    return (
        <div className="display__right__additional__content">
            <div className="rights__section__header">
                <h4 className="rights__section__title">
                    Edit {fullDisplayOriginal?.name}
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
                                            setFullDisplay({
                                                ...fullDisplay,
                                                hue: hueValue.toString()
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

            <div className="rights__section__body">
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




            <button id="save-changes-button" className={`primary-button width-100-auto ${rightChanged ? "" : "inactive"}`} onClick={() => {
                // Save changes to right
                if (fullDisplay && fullDisplayOriginal) {
                    alert("Saving changes to right...")
                    // Call backend to save changes
                    // On success, update localRights and close fullDisplay
                    // For now, just simulate saving
                    setLocalRights(prev => prev.map(r => r.id === fullDisplay.id ? { ...r, name: fullDisplayOriginal.name } : r))
                    setFullDisplay(null)
                    setFullDisplayOriginal(null)
                    setRightChanged(false);
                }
            }}>
                Save Changes
            </button>
        </div>
    )
}

export default EditRightRight;