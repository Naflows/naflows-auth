import { useEffect, useState } from "react";
import Input from "../../../../../../../../../../../global/components/Input";
import type { ServiceRights } from "../../../../../../../../../../../types/TunnelingTypes";


const NASS_RIGTS = {
    "MANAGE_TUNNELS": {
        name: "Tunnel Management",
        description: "Allows the user to create, modify, and delete tunnels within the NASS."
    },
    "MANAGE_DEVS": {
        name: "Developer Management",
        description: "Grants the ability to add or remove developers associated with the service."
    },
    "VIEW_STATS": {
        name: "View Statistics",
        description: "Permits access to view usage statistics and analytics for the service."
    },
    "VIEW_LOGS": {
        name: "View Logs",
        description: "Allows the user to access and review logs related to the service's operations."
    },
    "MANAGE_USERS": {
        name: "User Management",
        description: "Allows the user to add or remove users from the service."
    },
    "MANAGE_ROLES": {
        name: "Role Management",
        description: "Grants the ability to create, modify, and delete roles within the service."
    },
    "MANAGE_SERVICE": {
        name: "Service Management",
        description: "Enables the user to modify service settings and configurations."
    },
    "MANAGE_SETTINGS": {
        name: "Settings Management",
        description: "Allows the user to change various settings related to the service."
    },
    "VIEW_USERS": {
        name: "View Users",
        description: "Permits access to view the list of users associated with the service."
    },
    "VIEW_ROLES": {
        name: "View Roles",
        description: "Grants the ability to see the roles defined within the service."
    },
    "VIEW_SERVICE": {
        name: "View Service",
        description: "Allows the user to view service details and information."
    },
    "VIEW_SETTINGS": {
        name: "View Settings",
        description: "Permits access to view the current settings of the service."
    },
    "DEV_TOKEN_CREATION": {
        name: "Developer Token Creation",
        description: "Enables the creation of developer tokens for accessing the service."
    },
    "PROD_TOKEN_CREATION": {
        name: "Production Token Creation",
        description: "Allows the generation of production tokens for secure access to the service."
    },
    "INSTANCE_STATUS_MONITORING": {
        name: "Instance Status Monitoring",
        description: "Allows monitoring of the status and health of service instances (includes starting and stopping instances)."
    }
}

const CreateRightsDefinition = ({
    rightSetValue, setRightSetValue
}: {
    rightSetValue: ServiceRights,
    setRightSetValue: React.Dispatch<React.SetStateAction<ServiceRights | null>>
}) => {
    const [value, setValue] = useState<string>("");
    const rightsMax = rightSetValue.type === "SERVICE_BY_NASS" ? Object.keys(NASS_RIGTS).length : 10;

    useEffect(() => {
        // Set even "enter" key to move to next section if button enabled
        const handleKeyDown = (e: KeyboardEvent) => {
            // Tab key
            if (e.key === "Tab") {
                e.preventDefault();
                if (value.trim() !== "" && !rightSetValue.rights.includes(value.trim()) && rightSetValue.rights.length < rightsMax) {
                    setRightSetValue({ ...rightSetValue, rights: [...rightSetValue.rights, value.toUpperCase()] });
                    setValue("");
                    // Reset value of input
                    const input = document.getElementById("rights-input") as HTMLInputElement;
                    if (input) {
                        input.value = "";
                    }
                }
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        }
    }, [rightSetValue, value])

    useEffect(() => {
        const input = document.getElementById("rights-input") as HTMLInputElement;
        if (input) {
            input.focus();
        }
    }, []);



    return (

        <>
            <div className="form__section" style={{
                display: rightSetValue.type === "TUNNELING_BY_INSTANCE" ? "flex" : "none"
            }}>
                <div className="form__section__header">
                    <div className="inputs__container__header">
                        <h4>Rights</h4>
                        <p>Define the specific rights associated with this right set. Enter each right on a new line.</p>
                    </div>
                    <div className="info-box">
                        <p><strong>Note:</strong> Rights are case-sensitive and should be unique within this right set. Common rights include "READ", "WRITE", "DELETE", etc. Ensure that the rights you define here align with your service's access control policies.</p>
                    </div>
                </div>
                <div className="inputs__container">
                    <Input
                        label="Rights"
                        value={value}
                        onChange={(e) => {
                            const va = typeof e === "string" ? e : e.target.value;
                            setValue(va);
                        }}
                        onError={(e) => {
                            // Check for special characters, numbers or whitespace
                            const lines = e.split("\n");
                            // Pour inclure les espaces comme invalides, filtrez les lignes qui contiennent des caractères non alphabétiques (A-Z, a-z) uniquement.
                            const invalidLines = lines.filter(line => !/^[A-Za-z_]+$/.test(line));
                            if (invalidLines.length > 0) {
                                // Handle invalid lines
                                return true;
                            } else {
                                return false;
                            }
                        }}
                        errorMessage="No special characters, numbers or whitespace are allowed."
                        fitContent={false}
                        type="textarea"
                        name="rights"
                        required={false}
                        aboutModeText="Press Tab to add a new right. Each right should be on a new line. No special characters except _ are allowed. Example: READ_ALL, WRITE_DATA."
                        aboutMode={true}
                    />
                </div>
                <div className="rights__container__form__content">
                    <span className="rights__container__form__title">Current Rights ({rightSetValue.rights.length}/{rightsMax})</span>
                    {
                        rightSetValue.rights.map((right, index) => (
                            <div key={index} className="right__item">
                                <span>{right}</span>
                                <div className="button-content">
                                    <button onClick={() => {
                                        const newRights = rightSetValue.rights.filter((_, i) => i !== index);
                                        setRightSetValue({ ...rightSetValue, rights: newRights });
                                    }} className="tertiary-button" title={`Remove right ${right}`}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className="form__section" style={{
                display: rightSetValue.type === "SERVICE_BY_NASS" ? "flex" : "none"
            }}>
                <div className="form__section__header">
                    <h4>NASS Only Rights Set</h4>
                    <p>This right set is designated to be used exclusively for the NASS (Naflows Authentication Service) and cannot be assigned to instances. NASS has predefined rights used to help you manage access within the service.<br />Please choose from the predefined rights below.</p>
                </div>
                {/* Table of the rights : name | description | checkbox */}
                <div className="nass__rights__table">
                    <div className="nass__rights__table__header">
                        <span id="right-name" className="nass__rights__table__header__item">Right Name</span>
                        <span id="right-description" className="nass__rights__table__header__item">Description</span>
                    </div>
                    <div className="nass__rights__table__content">
                        {
                            Object.entries(NASS_RIGTS).map(([key, right]) => (
                                <div key={key} className={`nass__rights__table__row ${rightSetValue.rights.includes(key) ? "selected" : ""}`} onClick={() => {
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
                                }}>
                                    <span className="nass__rights__table__row__item" id="right-name">{right.name}</span>
                                    <span className="nass__rights__table__row__item" id="right-description">{right.description}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>

    )
}

export default CreateRightsDefinition;