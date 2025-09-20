import Input from "../../../global/components/Input";
import type { UserBodyProps } from "../../../types/UserBodyProps";

const AccountDetails = ({
  userData,
}: {
  userData: UserBodyProps | undefined;
}) => {
  if (userData) {
    return (
      <div className="user__body__details user__body__section">
        <h3 className="body__section__title">Account Details</h3>
        <div className="user__body__details__content">
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
