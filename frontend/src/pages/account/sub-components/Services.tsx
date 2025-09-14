import type { ServicesBodyProps } from "../../../types/ServicesBodyProps";
import "../../../../public/root/pages/account/sub-components/AccountServicesBody.scss";
import BasicServiceBody from "./ServicesBody";

const ServicesComponent = ({
  servicesData,
}: {
  servicesData: ServicesBodyProps[];
}) => {
  console.log(servicesData, "servicesData");
  const userServices = servicesData.filter(
    (service) =>
      service.user_role.includes("ADMINISTRATOR") ||
      service.user_role.includes("DEVELOPER")
  );
  const userConnections = servicesData.filter((service) =>
    service.user_role.includes("USER")
  );

  return (
    <div className="user__body__services">
      <div className="user__body__section">
        <div className="services__list">
          <div className="services__section__header">
            <div className="section__header__content">
              <h3 className="connections__list__title">Your Services</h3>
              <p>
                Services are projects where you have an administrative role.
              </p>
            </div>
            <button
              className="primary-button"
              onClick={() => {
                alert("Feature coming soon!");
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
          <div className="services__list__content">
            {userServices.length > 0 ? (
              userServices.map((service) => (
                <div key={service.id} className="service__item">
                  <BasicServiceBody service={service} />
                  <button className="primary-button">Manage service</button>
                </div>
              ))
            ) : (
              <p>No services found.</p>
            )}
          </div>
        </div>
      </div>

      <div className="user__body__section">
        <div className="services__list">
          <div className="services__section__header">
            <div className="section__header__content">
              <h3 className="connections__list__title">Your Connections</h3>
              <p>Connections are services where you have a user role without</p>
            </div>
          </div>
          <div className="services__list__content">
            {userConnections.length > 0 ? (
              userConnections.map((service) => (
                <div key={service.id} className="service__item">
                  <BasicServiceBody service={service} />
                  <div className="service__item__buttons">
                    <button className="primary-button">Manage connection</button>
                    <button className="secondary-button">
                        Quick disconnect
                    </button>
                  </div>
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
