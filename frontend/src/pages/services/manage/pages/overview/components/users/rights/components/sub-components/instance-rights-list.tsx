import Input from "../../../../../../../../../../global/components/Input";
import type { ServiceRights } from "../../../../../../../../../../types/TunnelingTypes";
import NASS_RIGTS from "./nass-rights";

const InstanceRightsList = ({
    value, setValue,
    rightSetValue,
    setRightSetValue
}: {
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    rightSetValue: ServiceRights | null,
    setRightSetValue: React.Dispatch<React.SetStateAction<ServiceRights | null>>,
}) => {
    if (!rightSetValue) {
        return null;
    }
    
    const rightsMax = rightSetValue.type === "SERVICE_BY_NASS" ? Object.keys(NASS_RIGTS).length : 10;

    return (
        <>
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
        </>
    )
}

export default InstanceRightsList;