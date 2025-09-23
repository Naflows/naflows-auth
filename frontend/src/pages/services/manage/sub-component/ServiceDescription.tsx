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
          <button className="secondary-button" style={{
            width: "100%",
          }}>Edit Service</button>
        </div>
      </div>
    );
  }
};

export default ServiceDescription;
