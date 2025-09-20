import { useEffect, useState } from "react";
import fetchData from "../../../scripts/account/get-user-info";
import AccountHeader from "../../account/account-header/AccountHeader";
import type { UserBodyProps } from "../../../types/UserBodyProps";
import "../../../../public/root/index.scss";
import "../../../../public/root/pages/account/sub-components/AccountUserBody.scss";
import "../../../../public/root/pages/account/sub-components/AccountServicesBody.scss";
import "../../../../public/root/pages/services/manage/index.scss";
import "../../../../public/root/pages/account/index.scss";
import Loader from "../../../global/components/Loader";
import fetchServiceData from "../../../scripts/account/fetch-individual-service";
import type { AxiosResponse } from "axios";
import type { ServicesForUserProps } from "../../../types/ServicesForUserProps";
import ServiceStorage from "./sub-component/ServiceStorage";
import ServiceDescription from "./sub-component/ServiceDescription";
import ServiceCapacities from "./sub-component/ServiceCapacities";
import ServicePublicSettings from "./sub-component/PublicSettings";
import SecurityMeasures from "./sub-component/SecurityMeasures";

const ManageService = () => {
  const [serviceID, setServiceID] = useState<string | null>(null);
  const [service, setService] = useState<ServicesForUserProps | null>(null);
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
          const res = (await fetchData("user")) as AxiosResponse;
          await fetchServiceData(
            serviceID,
            setService as (data: object) => void
          );
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

  if (!user || !service) {
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
          <div
            className="parent__of__section row__layout"
            style={{
              width: "100%"
            }}
          >
            <div className="parent__of__section column__layout" style={{
              flex: 1.5,
              height: "max-content",
              justifyContent: "space-between",
              alignSelf: "stretch",
              minHeight: "100%"
            }}>
              <SecurityMeasures service={service} />
              <div className="parent__of__section row__layout" style={{
                flex: 1,
                
              }}>
                <ServiceDescription service={service} />
                <ServicePublicSettings service={service} />
              </div>
            </div>
            <div className="parent__of__section column__layout" style={{
              flex: 0.5,
              height: "max-content",
              justifyContent: "space-between",
              alignSelf: "stretch",
              minHeight: "100%",
            }}>
              <ServiceStorage service={service} />
              <ServiceCapacities service={service} />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ManageService;
