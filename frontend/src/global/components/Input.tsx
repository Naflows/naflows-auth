import { useEffect, useRef, useState } from "react";

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
  maxChar?: number;
  displayMaxChar?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  onChange = undefined,
  maxChar = 100,
  displayMaxChar = false,
}: InputProps) => {
  const [valueIn, setValueIn] = useState<boolean>(value ? true : false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyButtonRef = useRef<HTMLButtonElement>(null);

  if (onChange === undefined) {
    onChange = (el: React.ChangeEvent<HTMLInputElement>) => {
      const value = el.currentTarget.value;
      if (value.replace(" ", "") !== "") {
        setValueIn(true);
      } else {
        setValueIn(false);
      }
    }
  }

  useEffect(() => {
    if (allowCopy && value) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied, allowCopy, value]);

  useEffect(() => {
    if (copyButtonRef.current) {
      // Set input width to fit content without overflowing on copy button
      const input = document.getElementById(name + "-input") as HTMLInputElement;
      if (input) {
        input.style.paddingRight = copyButtonRef.current.offsetWidth + 20 + "px";
        input.style.width = fitContent ? "auto" : `calc(100% - ${copyButtonRef.current.offsetWidth + 40}px)`;
      }
    } else if (displayMaxChar) {
      const input = document.getElementById(name + "-input") as HTMLInputElement;
      if (input) {
        input.style.paddingRight = 60 + "px";
        input.style.width = fitContent ? "auto" : `calc(100% - 90px)`;
      }
    }
  }, [copyButtonRef, name, fitContent, isCopied, value, displayMaxChar]);

  return (
    <div
      className={
        "inputs-container two-rows global__input"
      }

    >
      <div className={"global__input__content" + (allowCopy ? " allow-copy" : "") + (value || valueIn ? " filled" : "")}>
        <label htmlFor={name} className="text-size-20">
          {label}
        </label>
        <input
          className="text-size-20"
          type={type}
          name={name}
          id={name + "-input"}
          defaultValue={value}
          onInput={onChange}

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
            ref={copyButtonRef}
          >
            <span>{isCopied ? "Copied!" : "Copy"}</span>
          </button>
        ) : null}

        {maxChar && displayMaxChar ? (
          <p className="character-count">{value ? value.length : 0}/{maxChar}</p>
        ) : null}

      </div>

      {aboutMode && aboutModeText ? (
        <p className="about-mode text-size-14">{aboutModeText}</p>
      ) : null}
    </div>
  );
};

export default Input;
