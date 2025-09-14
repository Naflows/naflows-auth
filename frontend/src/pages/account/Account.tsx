// ...existing code...
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import axios from "axios";
import "../../../public/root/index.scss";
import "../../../public/root/pages/account/index.scss";
import Loader from "../../global/components/Loader";
import AccountUserBody from "./sub-components/UserBody";
import type { UserBodyProps } from "../../types/UserBodyProps";
import "../../../public/root/pages/account/index.scss";
import type { ServicesBodyProps } from "../../types/ServicesBodyProps";
import AccountHeader from "./account-header/AccountHeader";
import ServicesComponent from "./sub-components/Services";

const Account = () => {
  const [userFetch, setUserFetch] = useState<UserBodyProps | undefined>(
    undefined
  );
  const [servicesFetch, setServicesFetch] = useState<ServicesBodyProps[]>([]);
  const [scrollLevel, setScrollLevel] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);
  const [selectedTab, setSelectedTab] = useState<string>("profile");

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

  const fetch = async () => {
    try {
      const dir = {
        profile: { val: "user" },
        services: { val: "services" },
        security: { val: "security" },
        billing: { val: "billing" },
        support: { val: "support" },
      };
      console.log(selectedTab + " tab selected");
      const res = await fetchData(
        dir[selectedTab as keyof typeof dir]?.val || "user"
      );
      console.log("Fetch response:", res.data.data);
      if (res.data.success === false) {
        // Handle error (e.g., redirect to login)
        window.location.href = "/login";
        return;
      }
      if (selectedTab === "profile") {
        setUserFetch(res.data.data.user as UserBodyProps);
      } else if (selectedTab === "services") {
        setServicesFetch(res.data.data.services as ServicesBodyProps[]);
      }
      setSuccessfulFetch(true);
    } catch (error) {
      // Handle fetch error
      window.location.href = "/login";
      console.error("Error fetching user info:", error);
    }
  };
  useEffect(() => {
    if (selectedTab) {
      fetch();
    }
  }, [selectedTab]);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollLevel(position);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollLevel]);

  useEffect(() => {
    const header = document.querySelector(
      ".nass__account__page__header"
    ) as HTMLElement;
    if (header !== null) {
      if (scrollLevel > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
  }, [scrollLevel]);

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
            ref={ref}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />

          {selectedTab === "profile" && (
            <AccountUserBody userData={userFetch} />
          )}
          {selectedTab === "services" && (
            <ServicesComponent servicesData={servicesFetch} />
          )}

          <pre>{JSON.stringify(userFetch, null, 2)}</pre>
          <pre>{JSON.stringify(servicesFetch, null, 2)}</pre>
        </div>
      </div>
    );
  }
};

export default Account;
