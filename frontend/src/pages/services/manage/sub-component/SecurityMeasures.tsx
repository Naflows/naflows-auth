import { useEffect, useState } from "react";
import type { ServicesForUserProps } from "../../../../types/ServicesForUserProps";

async function checkServiceReachability(
  service: ServicesForUserProps | null,
  setReachable: (value: "Pinging" | "Success" | "Failure") => void
) {
  const res = fetch(service?.ip_address || "", {
    method: "GET",
    mode: "no-cors",
  });
  res
    .then(() => {
      setReachable("Success");
    })
    .catch(() => {
      setReachable("Failure");
    });

  setTimeout(async () => {
    setReachable("Pinging");
  }, 10000);
}

const SecurityMeasures = ({
  service,
}: {
  service: ServicesForUserProps | null;
}) => {
  const [reachable, setReachable] = useState<"Pinging" | "Success" | "Failure">(
    "Pinging"
  );
  useEffect(() => {
    if (reachable === "Pinging" && service) {
      checkServiceReachability(service, setReachable);
    }
  }, [reachable, service]);
  if (service) {
    return (
      <div className="security__measures">
        <div className="services__section__content">
          <div className="service__actions">
            <div className="service__actions__field">
              <div className="service__actions__field__header">
                <h3 className="service__actions__field__title">Settings</h3>
                <p>Quick access to user management</p>
              </div>
              <div className="service__actions__buttons">
                <button className="primary-button">
                  <span>Public Settings</span>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" /></svg>
                </button>
                <button className="primary-button">
                  <span>Permissions</span>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" /></svg>
                </button>
              </div>
            </div>
            <div className="service__actions__field">
              <div className="service__actions__field__header">
                <h3 className="service__actions__field__title">Users</h3>
                <p>Quick access to user management</p>
              </div>
              <div className="service__actions__buttons">
                <button className="primary-button">
                  <span>Analytics</span>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" /></svg>
                </button>
                <button className="primary-button">
                  <span>
                    Users & Invites
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" /></svg>
                </button>
              </div>
            </div>
            <div className="service__actions__field">
              <div className="service__actions__field__header">
                <h3 className="service__actions__field__title">
                  Internet Access
                </h3>
                <p>Monitor your service reachability</p>
              </div>
              <div className="service__actions__buttons">
                <button className="primary-button">
                  <span>{service.status !== "ACTIVE" ? "Restart Service" : "Pause Service"}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" /></svg>
                </button>
                <button className="primary-button">
                  <span>Manage DNS Records</span>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" /></svg>
                </button>
                <button className="primary-button">
                  <span>Service Authentication</span>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" /></svg>
                </button>
              </div>
            </div>
            <div className="service__actions__field">
              <div className="service__actions__field__header">
                <h3 className="service__actions__field__title">
                  Security Measures
                </h3>
                <p>Manage security in case of an attack</p>
              </div>
              <div className="service__actions__buttons">
                <button className="primary-button">
                  <span>NASS Contracts</span>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" /></svg>
                </button>
                <button className="primary-button">
                  <span>Firewall Rules</span>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" /></svg>
                </button>
                <button className="primary-button">
                  <span>Access Logs</span>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default SecurityMeasures;
