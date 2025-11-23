import "../public/root/index.scss";
import LoginForm from "./form/Login";
import { useEffect, useState } from "react";
import RegisterForm from "./form/Register";
import GlobalDisclaimer from "./global/components/GlobalDisclaimer";
import fetchServiceStatus from "./pages/home/scripts/fetch-status";
import type { ServiceStatus } from "./pages/home/components/Status";
import { NotificationProvider } from "./global/action-information/NotificationContent";
import NotificationContainer from "./global/action-information/NotificationContainer";

interface AppLoginBigButtonProps {
  onClick: () => void;
  value: string;
}

const AppLoginBigButton = ({ onClick, value }: AppLoginBigButtonProps) => {
  return (
    <button className="tertiary-button" onClick={onClick}>
      {value}
    </button>
  );
};

function App() {
  const [formType, setFormType] = useState<"login" | "register">("login");
  const [redirect, setRedirect] = useState<string | null>(null);
  const [logoutReason, setLogoutReason] = useState<string | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const form = queryParams.get("form");
    const r = queryParams.get("redirect");
    const reason = queryParams.get("reason");
    if (reason) {
      setLogoutReason(reason);
    }
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


  const [status, setStatus] = useState<ServiceStatus | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const status = await fetchServiceStatus();
      setStatus(status);
    };

    fetchStatus();

    const intervalId = setInterval(fetchStatus, 15000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>

      <NotificationProvider>
        <NotificationContainer />

        <div className="col-20 global__nass__form">
          <div className="panel" style={{
            marginTop: (logoutReason || redirect) ? "10px" : "80px",

          }}>
            <div className="disclaimers__container">
              {
                logoutReason && <GlobalDisclaimer
                  allowHidden={false}
                  title={`You have been logged out`}
                  message={""}
                  maxWidth={true}
                  fixed={false}
                  content={<>
                    {logoutReason === "outdated-session" && <p>Your session has expired due to inactivity. Please log in again to continue.</p>}
                    {logoutReason === "manual-logout" && <p>You have successfully logged out. We hope to see you again soon!</p>}
                    {logoutReason === "session-revoked" && <p>Your session has been revoked. Please log in again to continue.</p>}
                  </>}
                />
              }
              {
                redirect && <GlobalDisclaimer
                  allowHidden={true}
                  title={`This login will redirect you`}
                  message={""}
                  maxWidth={true}
                  fixed={false}
                  content={<>
                    <p>
                      Once logged in, you will be redirected to {redirect}. If you wish to log in to your account dashboard, please use <a href="/account">https://auth.naflows.com/account</a> instead.
                    </p>
                  </>}
                />
              }
            </div>
            <div className="panel-body">
              <img
                src="https://naflows.com/public/assets/naflows_full_logotype.png"
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
                {formType === "login" ? <LoginForm setFormType={setFormType} redirectOnSuccess={redirect ? redirect : undefined} /> : <RegisterForm setFormType={setFormType} />}
              </div>
            </div>
            <div className="panel-footer">
              <div className="footer-left">
                <h5>
                  {formType === "login"
                    ? "Having trouble logging in?"
                    : "Need help with registration?"}
                </h5>
                <div className="footer-buttons-container">
                  <AppLoginBigButton onClick={() => { }} value="I forgot my password" />
                  <AppLoginBigButton onClick={() => { }} value="I forgot my customer ID" />
                </div>
              </div>
              <div className="footer-right">
                <div className="service__status__small">
                  <span className={`service__status__indicator  ${status && status.disk.usagePercent
                    ? "service__status__indicator--active"
                    : "service__status__indicator--inactive"
                    }`}
                    data-tooltip={status && status.disk.usagePercent
                      ? `Disk Usage: ${status.disk.usagePercent}`
                      : "Service is currently unreachable"}
                  >
                    Service {status && status.disk.usagePercent ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </NotificationProvider>

    </>
  );
}

export default App;
