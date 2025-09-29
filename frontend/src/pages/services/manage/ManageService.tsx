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
import type { AxiosError, AxiosResponse } from "axios";
import type { ServicesForUserProps } from "../../../types/ServicesForUserProps";
import Alert, { type AlertContentProps } from "../../../global/error-alert/Alert";
import ManageServiceOverview from "./pages/overview";
import ManageServiceEdition from "./pages/edit";


type tabs = "overview" | "capacities" | "security" | "edit" | "network" | "settings" | "users";

const ManageService = () => {
  const [serviceID, setServiceID] = useState<string | null>(null);
  const [service, setService] = useState<ServicesForUserProps | null>(null);
  const [user, setUser] = useState<UserBodyProps | null>(null);
  const [displayAlert, setDisplayAlert] = useState<AlertContentProps>({
    status: 0,
    message: "",
    success: false,
    closeAlert: true,
  });

  const [tab, setTab] = useState<tabs>("overview");

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[3];
    const tab = pathParts[4] as tabs;
    if (tab && ["overview", "capacities", "security", "edit", "network", "settings", "users"].includes(tab)) {
      setTab(tab);
    } else {
      setTab("overview");
    }
    if (id) {
      setServiceID(id);
    }
  }, []);

  useEffect(() => {
    // Fetch user data from the backend
    if (serviceID != null && service == null) {
      (async () => {
        try {
          const res = (await fetchData("user")) as AxiosResponse;
          await fetchServiceData(
            serviceID,
            setService as (data: object) => void
          );
          if (res.data == null) {
            throw new Error("Failed to fetch user data");
          }
          setUser(res.data.data.user as UserBodyProps);
        } catch (error) {
          console.log("Service data fetch returned status:", (error as AxiosError)?.response?.status);
          setDisplayAlert({
            status: (error as AxiosError)?.response?.status || 500,
            message: "Failed to fetch service data. Please try again. Make sure you have access to this service, or that it exists.",
            success: false,
            closeAlert: false,
            title: "Error Fetching Service Data",
            displayCode: true,
            customClose: { text: "Go to Services", action: () => { window.location.href = "/account/services"; } }
          });
        }
      })();
    }
  }, [serviceID, service]);



  if (displayAlert.status != 0) {
    return <Alert alert={displayAlert} setAlert={setDisplayAlert} />;
  }

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
  } else if (tab === "overview") {
    return (
      <div className="user__body__manage-service nass__page">
        <AccountHeader
          selectedTab="services"
          userFetch={user ? user : undefined}
        />
        <ManageServiceOverview service={service} />
      </div>
    );
  } else if (tab === "edit") {
    return (
      <div className="user__body__manage-service nass__page">
        <AccountHeader
          selectedTab="services"
          userFetch={user ? user : undefined}
        />
        <ManageServiceEdition service={service} />
      </div>
    );
  }
};

export default ManageService;
