import { useEffect, useState } from "react";
import Input from "../../../../../../../../../../../global/components/Input";
import type { ServiceRights } from "../../../../../../../../../../../types/TunnelingTypes";


const CreateRightsDefinition = ({
    rightSetValue, setRightSetValue
}: {
    rightSetValue: ServiceRights,
    setRightSetValue: React.Dispatch<React.SetStateAction<ServiceRights | null>>
}) => {
    const [value, setValue] = useState<string>("");
    const rightsMax = 10;

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

        <div className="form__section">
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

    )
}

export default CreateRightsDefinition;