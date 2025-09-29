import type { ServicesBodyProps } from "../../../types/ServicesBodyProps";
import "../../../../public/root/pages/account/sub-components/AccountServicesBody.scss";
import { useEffect, useState } from "react";
import type { ServicesCompleteBodyProps } from "../../../types/ServicesCompleteProps";
import ManageServiceConnection from "./ManageConnection";
import fetchServiceData from "../../../scripts/account/fetch-individual-service";
import ServiceDescription from "../../services/manage/sub-component/ServiceDescription";
import CompactServiceDescription from "../../services/manage/sub-component/ServiceCompactDescription";
import SearchService from "./core/services/SearchBar";

const ServicesComponent = ({
  servicesData,
}: {
  servicesData: ServicesBodyProps[];
}) => {
  const userServices = servicesData.filter(
    (service: ServicesBodyProps) =>
      service.rights.includes("ADMINISTRATOR") ||
      service.rights.includes("DEVELOPER")
  );
  const [fetchedUserServices, setFetchedUserServices] = useState<ServicesBodyProps[]>(userServices);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [serviceID, setServiceID] = useState<string | null>(null);
  const [serviceData, setServiceData] =
    useState<ServicesCompleteBodyProps | null>(null);

  const [servicesType, setServicesType] = useState<"services" | "connections">("services");

  
  useEffect(() => {
    const filteredServices = userServices.filter((service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFetchedUserServices(filteredServices);
  }, [searchQuery]);

  useEffect(() => {
    setSearchQuery("");
  }, [servicesType])

  const userConnections = servicesData.filter((service) =>
    service.rights.includes("USER")
  );


  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[3];
    if (id) {
      console.log("Found service ID in URL:", id);
      setServiceID(id);
      fetchServiceData(id, setServiceData as (data: object) => void);
    }
  }, []);


  useEffect(() => {
    if (serviceID != null) {
      console.log("Fetching data for service ID:", serviceID);
      fetchServiceData(serviceID, setServiceData as (data: object) => void);
    }
  }, [serviceID]);

  useEffect(() => {
    if (serviceData === null) {
      setServiceID(null);
      const url = new URL(window.location.href);
      url.searchParams.delete("manage");
      window.history.replaceState({}, "", url.toString());
    } else {
      const url = new URL(window.location.href);
      url.searchParams.set("manage", serviceData.id);
      window.history.replaceState({}, "", url.toString());
    }
  }, [serviceData])

  return (
    <div className="user__body__services">
      <div className="user__body__services__header">
        <div className="services__header__tabs">
          <button
            className={`services__header__tab ${servicesType === "services" ? "primary-button" : "secondary-button"}`}
            onClick={() => setServicesType("services")}
          >
            Your Services ({
              fetchedUserServices.length
            })
          </button>
          <button
            className={`services__header__tab ${servicesType === "connections" ? "primary-button" : "secondary-button"}`}
            onClick={() => setServicesType("connections")}
          >
            Your Connections ({userConnections.length})
          </button>
        </div>
      </div>
      <ManageServiceConnection service={serviceData} setService={setServiceData} />
      <div className="user__body__section" style={{
        display: servicesType === "services" ? "block" : "none",
      }}>
        <div className="services__list">
          <div className="service__actions__field no-padding">
            <div className="service__actions__field__header">
              <h3 className="service__actions__field__title">Your Services</h3>
              <p>Services you own or manage</p>
            </div>
            <button
              className="primary-button"
              onClick={() => {
                window.location.href = "/services/new";
              }}
              style={{
                width: 'fit-content',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z" />
              </svg>
              <span>New service</span>
            </button>
          </div>
          <SearchService onSearch={setSearchQuery} />
          <div className="services__list__content">
            {fetchedUserServices.length > 0 ? (
              fetchedUserServices.map((service) => (
                <CompactServiceDescription key={service.id} service={service} owned={true} />
              ))
            ) : (
              <p>No services found.</p>
            )}
          </div>
        </div>
      </div>

      <div className="user__body__section" style={{
        display: servicesType === "connections" ? "block" : "none",
      }}>
        <div className="services__list">
          <div className="service__actions__field no-padding">
            <div className="service__actions__field__header">
              <h3 className="service__actions__field__title">Your Connections</h3>
              <p>Services you're connected to</p>
            </div>
          </div>
          <SearchService onSearch={setSearchQuery} />
          <div className="services__list__content">
            {userConnections.length > 0 ? (
              userConnections.map((service) => (
                <div key={service.id} className="service__item">
                  <CompactServiceDescription service={service} owned={false} />
                </div>
              ))
            ) : (
              <p>No connections found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesComponent;
