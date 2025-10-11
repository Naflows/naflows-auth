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
  onChange?: (value: string | React.ChangeEvent<HTMLInputElement>) => void;
  onError?: (value: string) => boolean;
  errorMessage?: string;
}

const Input = ({
  label,
  type,
  name,
  required,
  maxLength,
  value = "",
  editMode = true,
  autoComplete = true,
  aboutMode = false,
  aboutModeText,
  allowCopy = false,
  fitContent = true,
  onChange = undefined,
  maxChar = 100,
  displayMaxChar = false,
  onError = undefined,
  errorMessage = undefined
}: InputProps) => {
  const [valueIn, setValueIn] = useState<boolean>(value ? true : false);
  const [inputValue, setInputValue] = useState<string>(value);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [displayError, setDisplayError] = useState<boolean>(false);

  const copyButtonRef = useRef<HTMLButtonElement>(null);

  const t = onChange ? onChange : (e: string) => { return e };
  onChange = (el: React.ChangeEvent<HTMLInputElement> | string) => {
    const v = typeof el === "string" ? el : el.currentTarget.value;

    if (maxChar != null && v.length > maxChar) {
      const input = document.getElementById(name + "-input") as HTMLInputElement;
      if (input) {
        input.value = v.substring(0, maxChar);
      }
      return;
    }
    if (v.replace(" ", "") !== "") {
      setValueIn(true);
    } else {
      setValueIn(false);
    }

    if (onError && onError(v) && errorMessage) {
      setDisplayError(true);
      t("");
    } else {
      setDisplayError(false);
      t(v);
    }


    setInputValue(v);

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
  }, [copyButtonRef, name, fitContent, isCopied, displayMaxChar]);

  return (
    <div
      className={
        "inputs-container two-rows global__input"
      }
      style={{
        width: fitContent ? "fit-content" : "calc(100% - 42px)",
      }}
      id={`${name}-input-container`}
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
          onInput={(e) => onChange && onChange(e.currentTarget.value)}
          style={{
            width: fitContent ? "fit-content" : "calc(100% - 42px)",
          }}
          size={fitContent && inputValue ? inputValue.length : undefined}
          required={required}
          disabled={!editMode}
          autoComplete={autoComplete ? "on" : "off"}
          {...(type === "number" && maxLength ? { maxLength } : {})}
          maxLength={type !== "number" && maxLength ? maxLength : undefined}
        />

        {allowCopy && inputValue && !editMode ? (
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
          <p className="character-count" style={{
            right : fitContent ? "10px" : "20px"
          }}>{inputValue ? inputValue.length : 0}/{maxChar}</p>
        ) : null}
        {displayError && errorMessage ? (
          <p className="error-message text-size-14">{errorMessage}</p>
        ) : null}
      </div>

      {aboutMode && aboutModeText ? (
        <p className="about-mode text-size-14" style={{
          marginTop: errorMessage && displayError ? "15px" : "0px"
        }}>{aboutModeText}</p>
      ) : null}


    </div>
  );
};

export default Input;
