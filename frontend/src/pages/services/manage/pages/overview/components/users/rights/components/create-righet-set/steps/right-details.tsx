import { useEffect } from "react";
import Input from "../../../../../../../../../../../global/components/Input";
import Switch from "../../../../../../../../../../../global/components/Switch";
import Textarea from "../../../../../../../../../../../global/components/Textarea";
import type { ServiceRights } from "../../../../../../../../../../../types/TunnelingTypes";


const CreateRightDetails = ({
    rightSetValue, setRightSetValue
} : {
    rightSetValue : ServiceRights,
    setRightSetValue : React.Dispatch<React.SetStateAction<ServiceRights | null>>
}) => {
    useEffect(() => {
        const input = document.getElementById("right-set-name") as HTMLInputElement;
        if (input) {
            input.focus();
        }
    }, []);


    return (
        <>
            <div className="form__section">
                <div className="form__section__header">
                    <div className="inputs__container__header">
                        <h4>Right Set Details</h4>
                        <p>Provide a name and description for the new right set you are creating for this service.</p>
                    </div>
                </div>
                <div className="inputs__container">
                    <Input
                        label="Right Set Name"
                        value={rightSetValue.name}
                        onChange={(e : string | React.ChangeEvent<HTMLInputElement>) => {
                            const v = typeof e === "string" ? e : e.target.value;
                            setRightSetValue({ ...rightSetValue, name: v });
                        }}
                        type="text"
                        name="rightSetName"
                        required={true}
                        maxChar={20}
                        displayMaxChar={true}
                        fitContent={false}
                    />
                    <div className="global__input">
                        <Textarea
                            label="Description (Optional)"
                            value={rightSetValue.description}
                            onChange={(e) => {
                                const v = typeof e === "string" ? e : e.target.value;
                                setRightSetValue({ ...rightSetValue, description: v });
                            }}
                            maxCharacters={100}
                            minHeight={50}
                        />
                    </div>
                </div>
            </div>
            <div className="form__section">
                <div className="global__input">
                    <Switch
                        label="Used for the NASS Only"
                        checked={rightSetValue.type === "SERVICE_BY_NASS"}
                        onChange={(e) => {
                            const newCheck = e ? "SERVICE_BY_NASS" : "TUNNELING_BY_INSTANCE";
                            if (newCheck != rightSetValue.type) {
                                setRightSetValue({ ...rightSetValue, type: newCheck });
                            }
                        }}
                        description="When enabled, this right set will be used exclusively for the NASS (Naflows Authentication Service)."
                    />
                </div>
            </div>
        </>
    )
}

export default CreateRightDetails;