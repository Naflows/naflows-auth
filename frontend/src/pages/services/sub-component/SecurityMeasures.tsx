import { useEffect, useState } from "react";
import type { ServicesForUserProps } from "../../../types/ServicesForUserProps";

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
      <div className="">
        <div className="security__measures">
          <div className="services__section__content">
            <div className="service__actions">
              <div className="service__actions__field">
                <div className="service__actions__field__header">
                  <h3 className="service__actions__field__title">
                    Internet Access
                  </h3>
                  <p>Monitor your service reachability</p>
                </div>
                <div className="service__actions__buttons">
                  <button className="primary-button">Pause Service</button>
                  <button className="secondary-button">
                    Break Naflows' Connection
                  </button>
                </div>
              </div>
              <div className="service__actions__field">
                <div className="service__actions__field__header">
                  <h3 className="service__actions__field__title">Users</h3>
                  <p>Quick access to user management</p>
                </div>
                <div className="service__actions__buttons">
                    <button className="primary-button">Analytics</button>
                  <button className="secondary-button">Manage Users</button>
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
                    Renew NASS Contract
                  </button>
                  <button className="primary-button">Activate Raid Mode</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default SecurityMeasures;
