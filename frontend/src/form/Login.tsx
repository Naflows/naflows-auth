import { useState } from "react";
import Input from "../global/components/Input";


const LoginForm = () => {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className="inputs-container two-columns">
        <div className="inputs-container two-rows global__input">
          <Input
            label="Customer ID"
            type="text"
            name="customerID"
            required
            maxLength={100}
          />
        </div>
        <div className="inputs-container two-rows global__input">
          <Input
            label="Identifier"
            type="number"
            name="identifier"
            required
            maxLength={9}
          />
        </div>
      </div>
      <div className="inputs-container global__input">
        <Input
          label="Password"
          type="password"
          name="password"
          required
          maxLength={100}
        />
      </div>
      <button
        className="primary-button text-size-20"
        onClick={async () => {
          setLoading(true);
          const response = await fetch("http://localhost:3000/client/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              identifier: "123456789",
              password: "W8JdVoy30xEa1hZ5aDVQ",
              userID: "1",
            }),
          });
          console.log(response);
          setLoading(false);
        }}
      >
        <span style={{
          display: loading ? "none" : "block"
        }}>Log in</span>

        <div className="naflows__button__loader" style={{
          display: loading ? "block" : "none"
        }}>
          <div className="naflows__button__loader__content"></div>
        </div>
      </button>
    </>
  );
};

export default LoginForm;
