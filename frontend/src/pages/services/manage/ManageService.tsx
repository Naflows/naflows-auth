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
import AccountDir from "./sub-component/ServiceDir";
import LatestLogs from "./pages/overview/components/latest-logs";
import ServiceRightsComponentGlobal from "./pages/overview/components/users/rights";
import ServiceNetwork from "./pages/overview/components/network";
import ServiceUsers from "./pages/overview/components/users";
import ServiceSettings from "./pages/overview/components/settings";
import Safety from "./pages/overview/components/safety";
import { SERVICE_OVERVIEW_TABS } from "./pages/overview/types/tabs.type";


export type accountTabs = "overview" | "capacities" | "security" | "edit" | "network" | "settings" | "users" | "logs" | "rights" | "safety";
const dirValues = {
  "overview": { title: "Service Overview", description: "View and manage your service details, performance metrics, and recent activity." },
  "capacities": { title: "Service Capacities", description: "Monitor and manage the capacities associated with your service." },
  "security": { title: "Service Security", description: "Review and enhance the security settings of your service to protect your data and resources." },
  "edit": { title: "Edit Service", description: "Update your service details and settings to keep your service information accurate and up-to-date." },
  "network": { title: "Service Network", description: "Manage the network settings and configurations for your service." },
  "settings": { title: "Service Settings", description: "Adjust the settings and preferences for your service to optimize its performance." },
  "users": { title: "Service Users", description: "Manage user access and permissions for your service." },
  "logs": { title: "Service Logs", description: "View and analyze the logs associated with your service for monitoring and troubleshooting." },
  "rights": { title: "Service Rights", description: "Manage the rights and permissions associated with your service." },
  "safety": { title: "Service Safety", description: "Review and manage the safety settings of your service to ensure its integrity and reliability." },
};

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

  const [tab, setTab] = useState<accountTabs>("overview");

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[3];
    if (id) {
      setServiceID(id);
    }
  }, []);

  useEffect(() => {
    console.log("Service ID from URL:", serviceID ? serviceID : "No ID", tab);

  }, [tab, serviceID])

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
  } else {
    return (
      <div className="user__body__manage-service nass__page">
        <AccountHeader
          selectedTab="services"
          userFetch={user ? user : undefined}
        />
        <AccountDir service={service} tab={tab} title={dirValues[tab].title} description={dirValues[tab].description} setTab={setTab} />
        <div className="service__overview__tabs">
          {SERVICE_OVERVIEW_TABS.map((tab_) => (
            <button
              key={tab_.id}
              className={`tab ${tab === tab_.id ? "primary-button" : "secondary-button"}`}
              style={{
                width: "100%"
              }}
              onClick={() => setTab(tab_.label.toLowerCase() as accountTabs)}
            >
              {tab_.label}
            </button>
          ))}
        </div>
        {tab === "overview" && <ManageServiceOverview service={service} setService={setService} setTab={setTab} tab={tab} />}
        {tab === "edit" && <ManageServiceEdition service={service} />}
        {tab === "logs" && <LatestLogs service={service} />}
        {tab === "rights" && <ServiceRightsComponentGlobal service={service} />}
        {tab === "network" && <ServiceNetwork service={service} />}
        {tab === "users" && <ServiceUsers
          service={service} setTab={setTab}
        />}
        {tab === "settings" && <ServiceSettings service={service} />}
        {tab === "safety" && <Safety service={service} />}
      </div>
    )
  }

};

export default ManageService;
