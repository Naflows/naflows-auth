import type { UserBodyProps } from "../../../types/UserBodyProps";
import '../../../../public/root/pages/account/sub-components/AccountUserBody.scss';
import AccountUserBodyProfilePicture from "./ProfilePicture";

const AccountUserBody = ({
  userData,
}: {
  userData: UserBodyProps | undefined;
}) => {
  if (userData) {
    return (
      <div className="nass__account__page_user__body">
        <div className="user__body__header">
          <AccountUserBodyProfilePicture
            profilePictureUrl={userData.profile_picture}
            altText={`Profile picture of ${userData.username}`}
          />
          <div className="user__header__informations">
            <h2>{userData.first_name} {userData.last_name}</h2>
            <p className="username">@{userData.username}</p>
          </div>
        </div>

        <div className="user__body__details">
            <h3>Account Details</h3>
            <div className="user__body__details__content">
                <div className="user__details">
                    <h3></h3>
                </div>
            </div>
        </div>
      </div>
    );
  }
};

export default AccountUserBody;
