import { useEffect, useState } from "react";


const Textarea = ({
    value, onChange, maxCharacters, label, name, required, minHeight = 150
}: {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    maxCharacters?: number;
    label?: string;
    name?: string;
    required?: boolean;
    minHeight?: number;
}) => {
    const [char, setChar] = useState<number>(0);
    const [valueIn, setValueIn] = useState<boolean>(value ? true : false);

    useEffect(() => {
        setValueIn(char > 0 ? true : false);
    }, [char])

    return (
        <div className={`global__input__content textarea-container ${valueIn || value ? "filled" : ""}`}>
            <label className="text-size-20 textarea-label" htmlFor="service-description">{label}</label>
            <textarea
                className="global__input text-size-20"
                placeholder="Service Description"
                maxLength={maxCharacters}
                defaultValue={value ? value : ""}
                onChange={(e) => {
                    if (onChange) onChange(e);
                    setChar(e.target.value.length);
                }}
                name={name}
                id={name}
                required={required}
                style={{ minHeight: minHeight }}
            />
            <p className="character-count">{char}/{maxCharacters ? maxCharacters : 0}</p>
        </div>
    )
}

export default Textarea;