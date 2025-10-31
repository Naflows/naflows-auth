import { useEffect, useState } from "react";


const Switch = ({
    label, checked,
    onChange, description,
    mandatory = false
}: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description: string;
    mandatory?: boolean;
}) => {
    const [ch, setChecked] = useState<boolean>(checked ? checked : false);

    useEffect(() => {
        onChange(ch ? ch : false);
    }, [ch, onChange])


    return (
        <div className="nass_switch" onClick={() => {
            setChecked(!ch);
        }}>
            <div className={`nass_switch__container ${ch ? "nass_switch__container--checked" : ""}`}>
                <div className="nass_switch__toggle"></div>
            </div>

            <div className="nass_switch__label">
                <h5>
                    {label}
                    <span className={`nass_switch__label__state ${ch ? "nass_switch__label__state--on" : "nass_switch__label__state--off"}`}>{ch ? "On" : "Off"}</span>
                    {mandatory && <span className={`nass_switch__label__mandatory ${!ch ? "nass_switch__label__mandatory--inactive" : ""}`}>*</span>}
                </h5>
                <p>{description}</p>
            </div>
        </div>
    )
}

export default Switch;