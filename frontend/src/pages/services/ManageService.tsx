import { useEffect, useState } from "react";
import fetchData from "../../scripts/account/get-user-info";
import AccountHeader from "../account/account-header/AccountHeader";
import type { UserBodyProps } from "../../types/UserBodyProps";
import "../../../public/root/index.scss";
import "../../../public/root/pages/account/sub-components/AccountUserBody.scss";
import "../../../public/root/pages/account/index.scss";
import Loader from "../../global/components/Loader";
import type { ServicesCompleteBodyProps } from "../../types/ServicesCompleteProps";
import fetchServiceData from "../../scripts/account/fetch-individual-service";
import type { AxiosResponse } from "axios";
import type { ServicesForUserProps } from "../../types/ServicesForUserProps";

const ManageService = () => {
  const [serviceID, setServiceID] = useState<string | null>(null);
  const [service, setService] = useState<ServicesForUserProps | null>(
    null
  );
  const [user, setUser] = useState<UserBodyProps | null>(null);

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[3];
    if (id) {
      setServiceID(id);
    }
  }, []);

  useEffect(() => {
    // Fetch user data from the backend
    if (serviceID != null) {
      (async () => {
        try {
          const res = await fetchData("user") as AxiosResponse;
          await fetchServiceData(serviceID, setService as (data: object) => void);
          console.log(res.data, "user data");
          if (res.data == null) {
            throw new Error("Failed to fetch user data");
          }
          setUser(res.data.data.user as UserBodyProps);
        } catch (error) {
          console.error("Error initializing page:", error);
          window.location.href = "/login?redirect=" + window.location.pathname;
        }
      })();
    }
  }, [serviceID]);

  

  if (!user) {
    return (
      <div
        className="nass__page__loader"
        style={{
          display: user == null ? "flex" : "none",
        }}
      >
        <h3>Loading services...</h3>
        <Loader loading={user == null} />
      </div>
    );
  } else {
    return (
      <div className="user__body__manage-service nass__page">
        <AccountHeader
          selectedTab="services"
          userFetch={user ? user : undefined}
        />

        <div className="manage__service__body">
          <h2>Manage Service: {serviceID}</h2>
          <p>This is where you can manage the service with ID: {serviceID}</p>
          {service && <pre>{JSON.stringify(service, null, 2)}</pre>}
        </div>
      </div>
    );
  }
};

export default ManageService;
