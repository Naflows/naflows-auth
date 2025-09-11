import type { UserBodyProps } from "../../../types/UserBodyProps";
import "../../../../public/root/pages/account/sub-components/AccountUserBody.scss";
import AccountDetails from "./AccountDetails";
import UserPersonalInformations from "./UserPersonalInformations";

const AccountUserBody = ({
  userData,
}: {
  userData: UserBodyProps | undefined;
}) => {
  if (userData) {
    return (
      <div className="nass__account__page_user__body">
        <AccountDetails userData={userData} />
        <UserPersonalInformations userData={userData} />
      </div>
    );
  }
};

export default AccountUserBody;
