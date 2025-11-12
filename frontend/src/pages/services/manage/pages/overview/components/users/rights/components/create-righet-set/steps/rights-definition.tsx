import { useEffect, useState } from "react";
import type { ServiceRights } from "../../../../../../../../../../../types/TunnelingTypes";
import NassRightsList from "../../sub-components/nass-rights-list";
import NASS_RIGTS from "../../sub-components/nass-rights";
import InstanceRightsList from "../../sub-components/instance-rights-list";



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
                <InstanceRightsList
                    value={value}
                    setValue={setValue}
                    rightSetValue={rightSetValue}
                    setRightSetValue={setRightSetValue}
                />
            </div>

            <div className="form__section" style={{
                display: rightSetValue.type === "SERVICE_BY_NASS" ? "flex" : "none"
            }}>
                <div className="form__section__header">
                    <h4>NASS Only Rights Set</h4>
                    <p>This right set is designated to be used exclusively for the NASS (Naflows Authentication Service) and cannot be assigned to instances. NASS has predefined rights used to help you manage access within the service.<br />Please choose from the predefined rights below.</p>
                </div>
                {/* Table of the rights : name | description | checkbox */}
                <NassRightsList rightSetValue={rightSetValue} setRightSetValue={setRightSetValue} />
            </div>
        </>

    )
}

export default CreateRightsDefinition;