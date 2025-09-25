import type { ServicesForUserProps } from "../../../../types/ServicesForUserProps";
import "../../../../../public/root/pages/services/manage/sub-components/ServiceDescription.scss";

const ServiceDescription = ({
  service,
}: {
  service: ServicesForUserProps | null;
}) => {
  if (service) {
    return (
      <div className="user__body__section service__description__section">
        <div className="service__description">
          <div className="services__section__content description__content">
            <img src={service.banner || "/default-service-banner.png"} alt="Service Banner" className="service__banner" />
            <div className="service__description__header">
              <div className="service__description__header">
                <div className="service__description__pseudo__image">
                  {service.picture ? (
                    <img src={service.picture} alt={service.name} />
                  ) : (
                    service.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="service__description__head">
                  <div className="service__description__name">
                    <h2>{service.name}</h2>
                    <a
                      href={`https://${service.dns}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tertiary-button"
                    >
                      https://{service.dns}
                    </a>
                  </div>
                  <div className="service__description">
                    <p>{service.description || "No description provided."}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="buttons-container">
            <button className="secondary-button">
              <span>Share</span>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240q17 0 28.5 11.5T480-800q0 17-11.5 28.5T440-760H200v560h560v-240q0-17 11.5-28.5T800-480q17 0 28.5 11.5T840-440v240q0 33-23.5 56.5T760-120H200Zm560-584L416-360q-11 11-28 11t-28-11q-11-11-11-28t11-28l344-344H600q-17 0-28.5-11.5T560-800q0-17 11.5-28.5T600-840h200q17 0 28.5 11.5T840-800v200q0 17-11.5 28.5T800-560q-17 0-28.5-11.5T760-600v-104Z"/></svg>
            </button>
            <button className="primary-button" style={{
              width: "100%",
            }}>
              <span>Edit Service</span>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z"/></svg>
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default ServiceDescription;
