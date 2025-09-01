import { useState } from "react";

interface InputProps {
  label: string;
  type: string;
  name: string;
  required: boolean;
  maxLength?: number;
}

const Input = ({ label, type, name, required, maxLength }: InputProps) => {

  const [valueIn, setValueIn] = useState<boolean>(false);

  return (
    <div className={"inputs-container two-rows global__input" + (valueIn ? " filled" : "")}>
      <label htmlFor={name} className="text-size-20">{label}</label>
      <input
        className="text-size-20"
        type={type}
        name={name}
        id={name}
        onInput={(el) => {
          const value = el.currentTarget.value;
          if (value.replace(' ','') !== '') {
            setValueIn(true);
          } else {
            setValueIn(false);
          }
        }}
        required={required}
        {...((type === "number") && maxLength ? { maxLength } : {})}
      />
    </div>
  );
};


export default Input;