import type { UserBodyProps } from "../../../types/UserBodyProps";
import AccountUserBodyProfilePicture from "../sub-components/ProfilePicture";

const AccountHeader = ({
  userFetch, ref 
}: {
  userFetch: UserBodyProps | undefined;
  ref: React.Ref<HTMLDivElement>;
}) => {
  if (userFetch) {
    return (
      <div className="nass__account__page__header" ref={ref}>
        <div className="header__tabs">
          <img src="../../../../public/assets/naflows-green.svg" alt="Naflows logo" className="logo" />
          <div className="tabs">
            <div className="header__tab active">Profile</div>
            <div className="header__tab">Services</div>
            <div className="header__tab">Security</div>
            <div className="header__tab">Billing</div>
            <div className="header__tab">Support</div>
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
