import { useEffect, useState } from "react";


const Switch = ({
    label, checked,
    onChange, description
}: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description: string;
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
                <h5>{label}</h5>
                <p>{description}</p>
            </div>
        </div>
    )
}

export default Switch;