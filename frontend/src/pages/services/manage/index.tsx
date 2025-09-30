import { useEffect, useState } from "react";
import AccountHeader from "../../account/account-header/AccountHeader";
import "../../../../public/root/index.scss";
import "../../../../public/root/pages/account/sub-components/AccountUserBody.scss";
import "../../../../public/root/pages/account/sub-components/AccountServicesBody.scss";
import "../../../../public/root/pages/services/manage/index.scss";
import "../../../../public/root/pages/account/index.scss";
import type { ServicesForUserProps } from "../../../types/ServicesForUserProps";
import Alert, { type AlertContentProps } from "../../../global/error-alert/Alert";
import ManageServiceOverview from "./tabs/overview";
import ManageServiceEdition from "./tabs/edit";
import AccountDir from "../components/service-directory";
import type { AccountTabs } from "../components/service-directory/types/account-tab.type";
import { FetchUserData } from "../../../root/scripts/fetch/user";
import fetchPublicServiceData from "../../../root/scripts/fetch/services/public-data";
import type { UserBodyProps } from "../../../types/UserBodyProps";
import GlobalLoader from "../../../root/components/global-loader";



const ManageService = () => {
  const [service, setService] = useState<ServicesForUserProps | null>(null);
  const [displayAlert, setDisplayAlert] = useState<AlertContentProps>({
    status: 0,
    message: "",
    success: false,
    closeAlert: true,
  });

  const [tab, setTab] = useState<AccountTabs>("overview");

  const user : UserBodyProps | null = FetchUserData(setDisplayAlert);

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[3];
    const tab = pathParts[4] as AccountTabs;
    if (tab && ["overview", "capacities", "security", "edit", "network", "settings", "users"].includes(tab)) {
      setTab(tab);
    } else {
      setTab("overview");
    }
    if (id != null) {
      fetchPublicServiceData(id, setService);

      if (!service) {
          setDisplayAlert({
            status: 500,
            message: "Failed to fetch service data. Please try again. Make sure you have access to this service, or that it exists.",
            success: false,
            closeAlert: false,
            title: "Error Fetching Service Data",
            displayCode: true,
            customClose: { text: "Go to Services", action: () => { window.location.href = "/account/services"; } }
          });
      }
    }
  }, []);





  if (displayAlert.status != 0) {
    return <Alert alert={displayAlert} setAlert={setDisplayAlert} />;
  }

  if (!user || !service) {
    return (
      <GlobalLoader loading={true} content={<span> Loading service information... </span>} />
    );
  } else if (tab === "overview") {
    return (
      <div className="user__body__manage-service nass__page">
        <AccountHeader
          selectedTab="services"
          userFetch={user ? user : undefined}
        />
        <AccountDir service={service} tab={tab} title="Service Overview" description="View and manage your service details, performance metrics, and recent activity." />
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
        <AccountDir service={service} tab={tab} title="Edit Service" description="Update your service details and settings to keep your service information accurate and up-to-date." />
        <ManageServiceEdition service={service} />
      </div>
    );
  }
};

export default ManageService;
