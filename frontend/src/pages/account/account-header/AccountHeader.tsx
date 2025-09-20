import { useEffect, useState } from "react";
import type { UserBodyProps } from "../../../types/UserBodyProps";
import AccountUserBodyProfilePicture from "../sub-components/ProfilePicture";

const AccountHeader = ({
  userFetch,
  selectedTab,
}: {
  userFetch: UserBodyProps | undefined;
  selectedTab: string;
}) => {
  const [scrollLevel, setScrollLevel] = useState<number>(0);
  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollLevel(position);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollLevel]);

  useEffect(() => {
    const header = document.querySelector(
      ".nass__account__page__header"
    ) as HTMLElement;
    if (header !== null) {
      if (scrollLevel > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
  }, [scrollLevel]);

  if (userFetch) {
    return (
      <div className="nass__account__page__header">
        <div className="header__tabs">
          <img
            src="/assets/naflows-green.svg"
            alt="Naflows logo"
            className="logo"
          />
          <div className="tabs">
            {["Profile", "Services", "Security", "Billing", "Support"].map(
              (tab) => (
                <a
                  key={tab}
                  className={`header__tab ${
                    selectedTab === tab.toLowerCase() ? "active" : ""
                  }`}
                  href={`/account/${tab.toLowerCase()}`}
                >
                  {tab}
                </a>
              )
            )}
          </div>
        </div>
        <div className="header__account">
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
      </div>
    );
  }
};

export default AccountHeader;
