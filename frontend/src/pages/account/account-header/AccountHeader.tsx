import { useEffect, useRef, useState } from "react";
import type { UserBodyProps } from "../../../types/UserBodyProps";
import AccountUserBodyProfilePicture from "../sub-components/ProfilePicture";


const icons = {
  "profile": {
    icon: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" /></svg>,
    link: "/account/profile"
  }
  ,
  "services": {
    icon: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m480-400-80-80 80-80 80 80-80 80Zm-85-235L295-735l128-128q12-12 27-18t30-6q15 0 30 6t27 18l128 128-100 100-85-85-85 85ZM225-295 97-423q-12-12-18-27t-6-30q0-15 6-30t18-27l128-128 100 100-85 85 85 85-100 100Zm510 0L635-395l85-85-85-85 100-100 128 128q12 12 18 27t6 30q0 15-6 30t-18 27L735-295ZM423-97 295-225l100-100 85 85 85-85 100 100L537-97q-12 12-27 18t-30 6q-15 0-30-6t-27-18Z" /></svg>,
    "security": <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-164q97-30 162-118.5T718-480H480v-315l-240 90v207q0 7 2 18h238v316Zm0 80q-7 0-13-1t-12-3q-135-45-215-166.5T160-516v-189q0-25 14.5-45t37.5-29l240-90q14-5 28-5t28 5l240 90q23 9 37.5 29t14.5 45v189q0 140-80 261.5T505-88q-6 2-12 3t-13 1Z" /></svg>,
    link: "/account/services"
  }
  ,
  security: {
    icon: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-164q97-30 162-118.5T718-480H480v-315l-240 90v207q0 7 2 18h238v316Zm0 80q-7 0-13-1t-12-3q-135-45-215-166.5T160-516v-189q0-25 14.5-45t37.5-29l240-90q14-5 28-5t28 5l240 90q23 9 37.5 29t14.5 45v189q0 140-80 261.5T505-88q-6 2-12 3t-13 1Z" /></svg>,
    link: "/account/security"
  },
  "billing": {
    icon: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-320h640v-160H160v160Z" /></svg>,
    link: "/account/billing"
  },
  "support": {
    icon: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M470-200h-10q-142 0-241-99t-99-241q0-142 99-241t241-99q71 0 132.5 26.5t108 73q46.5 46.5 73 108T800-540q0 134-75.5 249T534-111q-10 5-20 5.5t-18-4.5q-8-5-14-13t-7-19l-5-58Zm-11-121q17 0 29-12t12-29q0-17-12-29t-29-12q-17 0-29 12t-12 29q0 17 12 29t29 12Zm-87-304q11 5 22 .5t18-14.5q9-12 21-18.5t27-6.5q24 0 39 13.5t15 34.5q0 13-7.5 26T480-558q-25 22-37 41.5T431-477q0 12 8.5 20.5T460-448q12 0 20-9t12-21q5-17 18-31t24-25q21-21 31.5-42t10.5-42q0-46-31.5-74T460-720q-32 0-59 15.5T357-662q-6 11-1.5 21.5T372-625Z" /></svg>,
    link: "/support"
  }


}

const AccountHeader = ({
  userFetch,
  selectedTab,
}: {
  userFetch: UserBodyProps | undefined;
  selectedTab: string;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerWidth, setHeaderWidth] = useState(300);

  // On mount, set the initial header width
  useEffect(() => {
    if (headerRef.current) {
      setHeaderWidth(headerRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderWidth(headerRef.current.offsetWidth);
      const nassPage = document.querySelector(".nass__page") as HTMLElement;
      if (nassPage) {
        nassPage.style.paddingLeft = `${headerWidth}px`;
      }
    }
  }, [collapsed]);





  if (userFetch) {
    return (
      <div className={`nass__account__page__header ${collapsed ? "collapsed" : ""}`} ref={headerRef}>
        <div className="header__tabs">
          <img
            src={
              !collapsed ? "/assets/naflows-green.svg" : "/assets/naflows-logotype-round.svg"
            }
            alt="Naflows logo"
            className="logo"
          />
          <div className="tabs">
            {["Profile", "Services", "Security", "Billing", "Support"].map(
              (tab) => (
                <div
                  key={tab}
                  className={`${selectedTab === tab.toLowerCase() ? "primary-button" : "secondary-button"
                    } width-100-auto header__tab`}
                  onClick={() => {
                    window.location.href = icons[tab.toLowerCase() as keyof typeof icons].link;
                  }}
                >
                  <div className="tab__content">
                    {icons[tab.toLowerCase() as keyof typeof icons].icon}
                    <span className="tab-label">{tab}</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" /></svg>
                </div>
              )
            )}
          </div>
        </div>
        <div className="header__footer__content">
          <div className="header__account">
            <button className="secondary-button" onClick={() => {
              setCollapsed(!collapsed);
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m432-480 156 156q11 11 11 28t-11 28q-11 11-28 11t-28-11L348-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 28-11t28 11q11 11 11 28t-11 28L432-480Z" /></svg>
            </button>
            <div className="user__header__visual__access">
              <AccountUserBodyProfilePicture
                profilePictureUrl={userFetch.profile_picture}
                altText={`Profile picture of ${userFetch.username}`}
              />
              <div className="user__header__informations">
                <h3 className="name">
                  {userFetch.first_name} {userFetch.last_name}
                </h3>
                <p className="username">@{userFetch.username}</p>
              </div>
            </div>
          </div>
          <div className="legal">
            <p className="footer__text">© 2024 Naflows. All rights reserved.</p>
            <div className="footer__links">
              <a href="/terms" className="footer__link">Terms of Service</a>
              <a href="/privacy" className="footer__link">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default AccountHeader;
