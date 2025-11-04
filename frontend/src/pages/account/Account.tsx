// ...existing code...
import { useEffect, useState } from "react";
import "../../../public/root/index.scss";
import "../../../public/root/pages/account/index.scss";
import Loader from "../../global/components/Loader";
import AccountUserBody from "./sub-components/UserBody";
import type { UserBodyProps } from "../../types/UserBodyProps";
import "../../../public/root/pages/account/index.scss";
import type { ServicesBodyProps } from "../../types/ServicesBodyProps";
import AccountHeader from "./account-header/AccountHeader";
import ServicesComponent from "./sub-components/Services";
import fetchData from "../../scripts/account/get-user-info";

const Account = () => {
  const [userFetch, setUserFetch] = useState<UserBodyProps | undefined>(
    undefined
  );
  const [servicesFetch, setServicesFetch] = useState<ServicesBodyProps[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("");
  const dir = {
    profile: { val: "user" },
    services: { val: "services" },
    security: { val: "security", active: false },
    billing: { val: "billing", active: false },
    support: { val: "support", active: false },
  };
  const [successfulFetch, setSuccessfulFetch] = useState<boolean>(false);



  
  const fetch = async () => {
    try {
      const res = await fetchData(dir[selectedTab as keyof typeof dir]?.val);
      const userData = await fetchData("user");

      if (res.data.success === false) {
        // Handle error (e.g., redirect to login)
        window.location.href = "/login?redirect=" + window.location.pathname;
        return;
      }
      console.log(userData.data.user)
      setUserFetch(userData.data.user as UserBodyProps);
      if (selectedTab === "services") {
        setServicesFetch(res.data.services as ServicesBodyProps[]);
      }
      setSuccessfulFetch(true);
    } catch (error) {
      // Handle fetch error
      window.location.href = "/login" + "?redirect=" + window.location.pathname;
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    // On initial page load, set the selected tab based on the URL, then fetch data

    document.title = "Account - Naflows Auth";

    const pathParts = window.location.pathname.split("/");
    const tab = pathParts[2];
    console.log("Path parts:", pathParts, "Tab:", tab);
    if (tab && Object.keys(dir).includes(tab)) {
      setSelectedTab(tab);
    } else {
      setSelectedTab("profile");
    }
  }, []);

  useEffect(() => {
    if (selectedTab) {
      document.title = `Account - ${selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}`;
      fetch();
    }
  }, [selectedTab]);



  if (successfulFetch === false) {
    return (
      <div
        className="nass__page__loader"
        style={{
          display: !userFetch ? "flex" : "none",
        }}
      >
        <h3>Loading account informations</h3>
        <Loader loading={!userFetch} />
      </div>
    );
  } else {
    return (
      <div className="nass__page account-page">
        <div
          className="nass__account__page"
          style={{
            display: successfulFetch ? "block" : "none",
          }}
        >
          <AccountHeader
            userFetch={userFetch}
            selectedTab={selectedTab}
          />
          {selectedTab === "profile" && (
            <AccountUserBody userData={userFetch} setUserData={setUserFetch} />
          )}
          {selectedTab === "services" && (
            <ServicesComponent servicesData={servicesFetch} />
          )}
        </div>
      </div>
    );
  }
};

export default Account;
