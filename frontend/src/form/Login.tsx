import { useEffect, useRef, useState } from "react";
import Input from "../global/components/Input";
import Alert, { type AlertContentProps } from "../global/error-alert/Alert";
import { manageLogin } from "../scripts/login";
import Loader from "../global/components/Loader";

const LoginForm = ({
  redirectOnSuccess = "/account",
}: {
  redirectOnSuccess?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertContentProps>({
    status: 0,
    message: "",
    success: false,
    closeAlert: true,
  });

  const loginRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // On enter, click login button
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        loginRef.current?.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [])

  return (
    <>
      <Alert alert={alert} setAlert={setAlert} />

      <div className="inputs-container">
        <div className="global__input__container two-columns">
          <div className="inputs-container global__input">
            <Input
              label="Customer ID"
              type="text"
              name="customerID"
              required={true}
              maxLength={100}
              fitContent={false}
              editMode={true}
              onChange={() => { }}
            />
          </div>
          <div className="inputs-container global__input">
            <Input
              label="Identifier"
              type="text"
              name="identifier"
              required={true}
              maxLength={9}
              fitContent={false}
              autoComplete={false}
              editMode={true}
              onChange={() => { }}
            />
          </div>
        </div>
        <div className="inputs-container">
          <Input
            label="Password"
            type="password"
            name="password"
            required={true}
            maxLength={100}
            fitContent={false}
          />
        </div>
      </div>
      <div className="buttons-container">
        <button
          className="primary-button text-size-20 width-100-auto"
          onClick={async () => {
            await manageLogin(setLoading, setAlert, redirectOnSuccess);
          }}
          ref={loginRef}
        >
          <span
            style={{
              display: loading ? "none" : "block",
            }}
          >
            Log in
          </span>

          <Loader loading={loading} />
        </button>
        <span className="separator">Or</span>
        <button className="secondary-button  text-size-20 width-100-auto" onClick={() => {
          window.location.href = "/register";
        }}>
          Create an account
        </button>
      </div>
    </>
  );
};

export default LoginForm;
