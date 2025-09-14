import type { UserBodyProps } from "../../../types/UserBodyProps";
import AccountUserBodyProfilePicture from "../sub-components/ProfilePicture";

const AccountHeader = ({
  userFetch, ref,
  selectedTab, setSelectedTab
}: {
  userFetch: UserBodyProps | undefined;
  ref: React.Ref<HTMLDivElement>;
  selectedTab: string;
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
  if (userFetch) {
    return (
      <div className="nass__account__page__header" ref={ref}>
        <div className="header__tabs">
          <img src="../../../../public/assets/naflows-green.svg" alt="Naflows logo" className="logo" />
          <div className="tabs">
            {["Profile", "Services", "Security", "Billing", "Support"].map((tab) => (
              <div
                key={tab}
                className={`header__tab ${selectedTab === tab.toLowerCase() ? "active" : ""}`}
                onClick={() => setSelectedTab(tab.toLowerCase())}
              >
                {tab}
              </div>
            ))}
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
