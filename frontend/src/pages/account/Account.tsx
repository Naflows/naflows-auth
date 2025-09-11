// ...existing code...
import { useEffect, useState } from "react";
import axios from "axios";
import "../../../public/root/index.scss";
import Loader from "../../global/components/Loader";
import AccountUserBody from "./sub-components/UserBody";
import type { UserBodyProps } from "../../types/UserBodyProps";
import '../../../public/root/pages/account/index.scss';
import type { ServicesBodyProps } from "../../types/ServicesBodyProps";

const Account = () => {
  const [userFetch, setUserFetch] = useState<UserBodyProps | undefined>(undefined);
  const [servicesFetch, setServicesFetch] = useState<ServicesBodyProps[]>([]);


  const [successfulFetch, setSuccessfulFetch] = useState<boolean>(false);
  const fetchData = async (type: string) => {
    const res = await axios.get(
      `${process.env.DUMMY_API_URL_DEV}/get-user-info/${type}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res;
  };



  useEffect(() => {
    const fetch = async () => {
      try {
        const userRes = await fetchData("user");
        const servicesRes = await fetchData("services");
        if (userRes.data.success === false || servicesRes.data.success === false) {
          // Handle error (e.g., redirect to login)
          window.location.href = "/login";
          return;
        }
        setUserFetch(userRes.data?.data.user || undefined);
        setServicesFetch(servicesRes.data?.data.services || []);
      } catch (error) {
        // Handle fetch error
        window.location.href = "/login";
        console.error("Error fetching user info:", error);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (userFetch) {
      setSuccessfulFetch(true);
    }
  }, [userFetch, servicesFetch]);

  return (
    <div className="nass__page account-page">
      <div
        className="nass__account__page"
        style={{
          display: successfulFetch ? "block" : "none",
        }}
      >

        <AccountUserBody userData={userFetch} />

        <pre>{JSON.stringify(userFetch, null, 2)}</pre>
        <pre>{JSON.stringify(servicesFetch, null, 2)}</pre>
      </div>

      <div
        className="nass__page__loader"
        style={{
          display: !userFetch ? "flex" : "none",
        }}
      >
        <h3>Loading account informations</h3>
        <Loader loading={!userFetch} />
      </div>
    </div>
  );
};

export default Account;
