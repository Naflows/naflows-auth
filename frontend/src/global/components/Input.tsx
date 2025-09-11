import { useEffect, useState } from "react";

interface InputProps {
  label: string;
  type: string;
  name: string;
  required: boolean;
  maxLength?: number;
  value?: string;
  editMode?: boolean;
  autoComplete?: boolean;
  aboutMode?: boolean;
  aboutModeText?: string;
  allowCopy?: boolean;
  fitContent?: boolean;
}

const Input = ({
  label,
  type,
  name,
  required,
  maxLength,
  value,
  editMode = true,
  autoComplete = true,
  aboutMode = false,
  aboutModeText,
  allowCopy = false,
  fitContent = true,
}: InputProps) => {
  const [valueIn, setValueIn] = useState<boolean>(value ? true : false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    if (allowCopy && value) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied, allowCopy, value]);

  return (
    <div
      className={
        "inputs-container two-rows global__input"
      }

    >
      <div className={"global__input__content" + (valueIn ? " filled" : "")} style={{
        width: fitContent ? "fit-content" : "100%",
      }}>
        <label htmlFor={name} className="text-size-20">
          {label}
        </label>
        <input
          className="text-size-20"
          type={type}
          name={name}
          id={name}
          defaultValue={value}
          onInput={(el) => {
            const value = el.currentTarget.value;
            if (value.replace(" ", "") !== "") {
              setValueIn(true);
            } else {
              setValueIn(false);
            }
          }}
          style={{
            width: fitContent ? "auto" : "calc(100% - 40px)",
          }}
          size={fitContent && value ? value.length : undefined}
          required={required}
          disabled={!editMode}
          autoComplete={autoComplete ? "on" : "off"}
          {...(type === "number" && maxLength ? { maxLength } : {})}
        />

        {allowCopy && value && !editMode ? (
          <button
            className="copy-button secondary-button text-size-14 width-fit"
            onClick={() => {
              navigator.clipboard.writeText(value);
              setIsCopied(true);
            }}
          >
            <span>{isCopied ? "Copied!" : "Copy"}</span>
          </button>
        ) : null}
      </div>

      {aboutMode && aboutModeText ? (
        <p className="about-mode text-size-14">{aboutModeText}</p>
      ) : null}
    </div>
  );
};

export default Input;
