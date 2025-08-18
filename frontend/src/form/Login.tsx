import { useState } from "react";

const LoginForm = () => {
  const [viewPassword, setViewPassword] = useState(false);

  return (
    <>
      <div className="inputs-container two-rows">
        <label className="text-size-20">Identifier</label>
        <div className="identifier-input">
          {Array.from({ length: 9 }, (_, i) => (
            <input
              key={i}
              className="text-size-20"
              style={{ width: 15 }}
              type="text"
              placeholder={(i + 1).toString()}
              maxLength={1}
              inputMode="numeric"
              onKeyDown={(e) => {
                const input = e.currentTarget as HTMLInputElement;

                let followingInput: HTMLInputElement | null = null;

                const key = e.key;
                console.log("Key pressed:", key);

                if (key === "Backspace" || key === "0") {
                  if (input.value.length === 0) {
                    const prevInput =
                      input.previousElementSibling as HTMLInputElement | null;
                    if (prevInput) {
                      followingInput = prevInput;
                    } else {
                      followingInput = input;
                    }
                  }
                } else if (/^[0-9]$/.test(key)) {
                  e.preventDefault();

                  input.value = key;
                  const nextInput =
                    input.nextElementSibling as HTMLInputElement | null;
                  if (nextInput) {
                    followingInput = nextInput;
                  }
                }

                if (followingInput) {
                  followingInput.focus();
                  followingInput.setSelectionRange(0, 1);
                }
              }}
            />
          ))}
        </div>
      </div>
      <div className="inputs-container">
        <label className="text-size-20">Password</label>
        <input
          className="text-size-20"
          type={viewPassword ? "text" : "password"}
          placeholder="Enter your password"
        />
        <button
          className="icon-button"
          onClick={() => setViewPassword((prev) => !prev)}
        >
          {viewPassword ? "Hide" : "Show"} Password
        </button>
      </div>
      <button
        className="primary-button text-size-20"
        type="submit"
        onSubmit={() => {}}
      >
        Log in
      </button>
    </>
  );
};

export default LoginForm;
