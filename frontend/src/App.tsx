import NAFLOWS_LOGO from "../public/assets/naflows-green.svg";
import "../public/root/index.scss";
import LoginForm from "./root/components/service-connection/login";
import { useEffect, useState } from "react";
import RegisterForm from "./root/components/service-connection/Register";
import GlobalDisclaimer from "./global/components/GlobalDisclaimer";

interface AppLoginBigButtonProps {
  onClick: () => void;
  value: string;
}

const AppLoginBigButton = ({ onClick, value }: AppLoginBigButtonProps) => {
  return (
    <button className="tertiary-button text-size-20" onClick={onClick}>
      {value}
    </button>
  );
};

function App() {
  const [formType, setFormType] = useState<"login" | "register">("login");
  const [redirect, setRedirect] = useState<string | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const form = queryParams.get("form");
    const r = queryParams.get("redirect");
    setRedirect(r);
    if (form === "login" || form === "register") {
      setFormType(form as "login" | "register");
    } else {
      setFormType("login");
    }
  }, []);

  useEffect(() => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("form", formType);
    window.history.replaceState(null, "", newUrl);
  }, [formType]);

  return (
    <>
      <div className="col-20 global__nass__form">
        <div className="panel">
          {
            redirect && <GlobalDisclaimer
              allowHidden={true}
              title={`This login will redirect you`}
              message={""}
              maxWidth={true}
              content={<>
                <p>
                  Once logged in, you will be redirected to {redirect}. If you wish to log in to your account dashboard, please use <a href="/account">https://auth.naflows.com/account</a> instead.
                </p>
              </>}
            />
          }
          <img
            src={NAFLOWS_LOGO}
            alt="Naflows Logo"
            className="logo"
            style={{ height: "100px" }}
          />
          <div className="panel-header">
            <h1>
              {formType === "login"
                ? "Welcome back to the NASS"
                : "Create an account"}
            </h1>
            <p>
              {formType === "login"
                ? "Please enter your credentials. If you don't have an account, you can create one."
                : "Please fill in the form to create an account. Once your account is created, you will receive your set identifier and customer ID via email."}
            </p>
          </div>
          <div className="form">
            {formType === "login" ? <LoginForm redirectOnSuccess={redirect ? redirect : undefined} /> : <RegisterForm />}
          </div>
          <div className="panel-footer">
            <AppLoginBigButton
              onClick={() => {
                setFormType(formType === "login" ? "register" : "login");
              }}
              value={formType === "login" ? "Sign up" : "Log in"}
            />
            <AppLoginBigButton onClick={() => { }} value="Forgot password?" />
            <AppLoginBigButton onClick={() => { }} value="Forgot customer ID?" />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
