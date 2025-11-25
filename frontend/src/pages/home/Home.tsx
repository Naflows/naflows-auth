import { useEffect, useState } from "react";
import "../../../public/root/pages/home/index.scss";
import Status from "./components/status";
import WelcomeOverlay from "./components/welcome-overlay/WelcomeOverlay";
import type { ServiceStatus } from "../../types/ServiceStatus.type";

const Home = () => {
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus | null>(
    null
  );

  const [displayMenu, setDisplayMenu] = useState<boolean>(false);

  useEffect(() => {
    const root = document.querySelector('#root');
    if (displayMenu) {
      root?.classList.add('menu--active');
      document.body.style.overflow = "hidden";
    } else {
      root?.classList.remove('menu--active');
      document.body.style.overflow = "auto";
    }
  }, [displayMenu])

  return (
    <div className={`nass__home__page ${displayMenu ? "menu--active" : ""}`}>

      <div className={`global__home__header ${displayMenu ? "active" : ""}`}>

        <div className="header__navigation">
          <button className="secondary-button" onClick={() => {
            window.location.href = "/docs";
          }}>Documentation</button>
        </div>
        <div className="header__head">
          <img
            src="https://naflows.com/public/assets/naflows_full_logotype.png"
            alt="Naflows Logo"
          />
          <div className="button-display--header--phone" onClick={() => {
            setDisplayMenu(!displayMenu);
          }}>
            {!displayMenu ? (
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M160-240q-17 0-28.5-11.5T120-280q0-17 11.5-28.5T160-320h640q17 0 28.5 11.5T840-280q0 17-11.5 28.5T800-240H160Zm0-200q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520h640q17 0 28.5 11.5T840-480q0 17-11.5 28.5T800-440H160Zm0-200q-17 0-28.5-11.5T120-680q0-17 11.5-28.5T160-720h640q17 0 28.5 11.5T840-680q0 17-11.5 28.5T800-640H160Z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z" /></svg>
            )}
          </div>
        </div>

        <div className="header__actions">
          <div className="buttons__container">
            <button className="primary-button" onClick={() => {
              window.location.href = "/login";
            }}>
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
                display: "block",
              }}>
                <mask id="uniqueMaskId-login-icon" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
                  <rect width="100" height="100" rx="50" fill="#D9D9D9" />
                </mask>
                <g mask="url(#uniqueMaskId-login-icon)">
                  <path d="M0 100.5C0 77.5802 18.5802 59 41.5 59H58.5C81.4198 59 100 77.5802 100 100.5H0Z" fill="#D9D9D9" />
                  <rect x="25" y="4" width="50" height="50" rx="25" fill="#D9D9D9" />
                </g>
              </svg>
            </button>
          </div>

          <div className="status__container">
            <Status
              serviceStatus={serviceStatus}
              setServiceStatus={setServiceStatus}
            />
          </div>
        </div>
      </div>

      <WelcomeOverlay serviceStatus={serviceStatus} />

    </div>
  );
};

export default Home;
