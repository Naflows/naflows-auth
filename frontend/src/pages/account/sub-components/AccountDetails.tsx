import Input from "../../../global/components/Input";
import type { UserBodyProps } from "../../../types/UserBodyProps";
import '../../../../public/root/pages/account/sub-components/AccountUserBody.scss';

const AccountDetails = ({
  userData,
  setUserData
}: {
  userData: UserBodyProps | undefined;
  setUserData: React.Dispatch<React.SetStateAction<UserBodyProps | undefined>>;
}) => {
  if (userData) {
    return (
      <div className="user__body__details user__body__section">
        <div className="service__actions__field__header">
          <h3 className="service__actions__field__title">Account Details</h3>
          <span>
            Manage your account details, including your email address and phone
          </span>
        </div>
        <div className="user__body__details__content">
          <div className="user__image__upload">
            {
              userData.profile_picture ? (
                <img src={userData.profile_picture} alt="Profile Picture" />
              ) : (
                <div className="image__placeholder">
                  {userData.first_name?.charAt(0).toUpperCase()}{userData.last_name?.charAt(0).toUpperCase()}
                </div>
              )
            }
            <input type="file" accept="image/*" style={{ display: 'none' }} id="profilePictureInput" 
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const newProfilePicture = reader.result as string;
                    setUserData((prevData) => {
                      if (!prevData) return prevData;
                      return {
                        ...prevData,
                        profile_picture: newProfilePicture
                      };
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }} />
            <button className="secondary-button" onClick={() => {
              const input = document.getElementById('profilePictureInput');
              input?.click();
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M240-160q-33 0-56.5-23.5T160-240v-80q0-17 11.5-28.5T200-360q17 0 28.5 11.5T240-320v80h480v-80q0-17 11.5-28.5T760-360q17 0 28.5 11.5T800-320v80q0 33-23.5 56.5T720-160H240Zm200-486-75 75q-12 12-28.5 11.5T308-572q-11-12-11.5-28t11.5-28l144-144q6-6 13-8.5t15-2.5q8 0 15 2.5t13 8.5l144 144q12 12 11.5 28T652-572q-12 12-28.5 12.5T595-571l-75-75v286q0 17-11.5 28.5T480-320q-17 0-28.5-11.5T440-360v-286Z" /></svg>
              <span>Change Picture</span>
            </button>
          </div>
          <div className="user__details">
            <div className="inputs-container global__input">
              <Input
                label="User ID"
                value={userData.id}
                type="text"
                name="userID"
                required={true}
                maxLength={100}
                autoComplete={false}
                editMode={false}
                aboutMode={true}
                fitContent={true}
                aboutModeText="This is your unique user ID and cannot be changed. It is used for account identification and authentication purposes."
                allowCopy={true}
              />
            </div>
            <div className="inputs-container global__input row-20">
              <Input
                label="Email"
                value={userData.email}
                type="email"
                name="email"
                required={true}
                maxLength={254}
                autoComplete={false}
                editMode={true}
              />
              <Input
                label="Phone Number"
                value={userData.phone_number}
                type="number"
                name="phoneNumber"
                required={true}
                maxLength={15}
                autoComplete={false}
                editMode={true}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default AccountDetails;
