import type { UserBodyProps } from "../../../types/UserBodyProps";
import "../../../../public/root/pages/account/sub-components/AccountUserBody.scss";
import AccountDetails from "./AccountDetails";
import UserPersonalInformations from "./UserPersonalInformations";
import { useEffect, useState } from "react";
import SaveChanges from "../../services/manage/pages/components/save";
import Alert, { type AlertContentProps } from "../../../global/error-alert/Alert";
import axios from "axios";
import Loader from "../../../global/components/Loader";

const AccountUserBody = ({
  userData,
  setUserData
}: {
  userData: UserBodyProps | undefined;
  setUserData: React.Dispatch<React.SetStateAction<UserBodyProps | undefined>>;
}) => {
  const [savedUserData, setSavedUserData] = useState<UserBodyProps | undefined>(userData);
  const [isDirty, setIsDirty] = useState(false);
  const [alert, setAlert] = useState<AlertContentProps>({
    status: 0,
    message: "",
    success: false,
    closeAlert: true,
  });

  useEffect(() => {
    setIsDirty(
      userData?.username !== savedUserData?.username ||
      userData?.email !== savedUserData?.email ||
      userData?.first_name !== savedUserData?.first_name ||
      userData?.last_name !== savedUserData?.last_name ||
      userData?.profile_picture !== savedUserData?.profile_picture ||
      userData?.phone_number !== savedUserData?.phone_number ||
      userData?.country !== savedUserData?.country ||
      userData?.city !== savedUserData?.city ||
      userData?.postal_code !== savedUserData?.postal_code ||
      userData?.address !== savedUserData?.address ||
      userData?.address_complement !== savedUserData?.address_complement
    )
  }, [userData])

  if (userData) {


    return (
      <div className="nass__account__page_user__body">
        <Alert alert={alert} setAlert={setAlert} />
        <SaveChanges appear={isDirty} onChange={async () => {

          const res = await axios.put(`${process.env.DUMMY_API_URL_DEV}/set-user-info/user/update`, {
            userDetails: {
              username: userData.username,
              first_name: userData.first_name,
              last_name: userData.last_name,
              profile_picture: userData.profile_picture,
              country: userData.country,
              city: userData.city,
              postal_code: userData.postal_code,
              address: userData.address,
              address_complement: userData.address_complement,
            }
          }, {
            withCredentials: true
          });
          if (res.status === 200) {
            setAlert({
              status: 200,
              message: "Changes saved successfully.",
              success: true,
              closeAlert: false,
              
            })
            setSavedUserData(userData);
            setIsDirty(false);
          } else {
            setAlert({
              status: res.data.status,
              message: res.data.message || "An error occurred while saving changes. Please try again.",
              success: res.data.success,
              closeAlert: false,
              displayCode: true,
            })
          }
        }} />
        <AccountDetails userData={userData} setUserData={setUserData} />
        <UserPersonalInformations userData={userData} setUserData={setUserData} />
      </div>
    );
  }
};

export default AccountUserBody;
