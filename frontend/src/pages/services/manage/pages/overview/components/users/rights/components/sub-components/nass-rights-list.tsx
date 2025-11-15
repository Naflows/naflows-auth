import Switch from "../../../../../../../../../../global/components/Switch";
import type { ServiceRights } from "../../../../../../../../../../types/TunnelingTypes";
import NASS_RIGTS from "./nass-rights";



const NassRightsList = ({
    rightSetValue,
    setRightSetValue,
    // Disable edition
    disabled,
}: {
    rightSetValue: ServiceRights | null,
    setRightSetValue: React.Dispatch<React.SetStateAction<ServiceRights | null>>,
    disabled?: boolean
}) => {

    if (!rightSetValue) {
        return null;
    }

    const rightsMax = rightSetValue.type === "SERVICE_BY_NASS" ? Object.keys(NASS_RIGTS).length : 10;



    return (
        <div className="nass__rights__table">
            <div className="nass__rights__table__content">
                {
                    Object.entries(NASS_RIGTS).map(([key, right]) => (
                        <div key={key} className={`nass__rights__table__row`}>
                            <Switch
                                label={right.name}
                                checked={rightSetValue.rights.includes(key)}
                                onChange={(checked) => {
                                    // Check if something changes to prevent infinite loop
                                    if (checked != rightSetValue.rights.includes(key)) {
                                        const checked = rightSetValue.rights.includes(key);
                                        if (!checked) {
                                            console.log("Adding right:", key);
                                            // Add right
                                            if (!rightSetValue.rights.includes(key) && rightSetValue.rights.length < rightsMax) {
                                                setRightSetValue({ ...rightSetValue, rights: [...rightSetValue.rights, key] });
                                            }
                                        } else {
                                            console.log("Removing right:", key);
                                            // Remove right
                                            const newRights = rightSetValue.rights.filter(r => r !== key);
                                            setRightSetValue({ ...rightSetValue, rights: newRights });
                                        }
                                    }
                                }}
                                disabled={disabled}
                                additionalClass={`header-full-space ${disabled ? "disabled" : ""}`}
                                description={right.description}
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default NassRightsList;