import { useState } from "react";
import Input from "../global/components/Input";
import axios from "axios";
import Alert from "../global/error-alert/Alert";
import { manageLogin } from "../scripts/login";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    code: 0,
    message: "",
    closeAlert: true,
  });

  return (
    <>
      <Alert alert={alert} setAlert={setAlert} />

      <div className="inputs-container two-columns">
        <div className="inputs-container two-rows global__input">
          <Input
            label="Customer ID"
            type="text"
            name="customerID"
            required={true}
            maxLength={100}
          />
        </div>
        <div className="inputs-container two-rows global__input">
          <Input
            label="Identifier"
            type="number"
            name="identifier"
            required={true}
            maxLength={9}
          />
        </div>
      </div>
      <div className="inputs-container global__input">
        <Input
          label="Password"
          type="password"
          name="password"
            required={true}
          maxLength={100}
        />
      </div>
      <button
        className="primary-button text-size-20"
        onClick={async () => {
          await manageLogin(setLoading, setAlert);
        }}
      >
        <span
          style={{
            display: loading ? "none" : "block",
          }}
        >
          Log in
        </span>

        <div
          className="naflows__button__loader"
          style={{
            display: loading ? "block" : "none",
          }}
        >
          <div className="naflows__button__loader__content"></div>
        </div>
      </button>
    </>
  );
};

export default LoginForm;
