import Input from "../../../global/components/Input";
import type { UserBodyProps } from "../../../types/UserBodyProps";

const UserPersonalInformations = ({
  userData,
}: {
  userData: UserBodyProps | undefined;
}) => {
  if (userData) {
    return (
      <div className="user__body__personal-informations user__body__section">
        <h3 className="body__section__title">Personal Informations</h3>
        <div className="user__details">
          <div className="inputs-container global__input">
            <Input
              label="Country"
              value={userData.country}
              type="text"
              name="country"
              required={true}
              maxLength={56}
              autoComplete={false}
              editMode={true}
              fitContent={false}
            />
            <Input 
                label="City"
                value={userData.city}
                type="text"
                name="city"
                required={true}
                maxLength={85}
                autoComplete={false}
                editMode={true}
                fitContent={false}
            />
            <Input 
                label="Postal Code"
                value={userData.postal_code}
                type="text"
                name="postal_code"
                required={true}
                maxLength={20}
                autoComplete={false}
                editMode={true}
                fitContent={false}
            />
            <Input 
                label="Address"
                value={userData.address}
                type="text"
                name="address"
                required={true}
                maxLength={100}
                autoComplete={false}
                editMode={true}
                fitContent={false}
            />
            <Input 
                label="Address Complement"
                value={userData.address_complement}
                type="text"
                name="address_complement"
                required={false}
                maxLength={100}
                autoComplete={false}
                editMode={true}
                fitContent={false}
            />

          </div>
        </div>
      </div>
    );
  }
};

export default UserPersonalInformations;
