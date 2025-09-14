import type { ServicesForUserProps } from "../../../types/ServicesForUserProps";
import "../../../../public/root/pages/services/manage/sub-components/ServiceDescription.scss";

const ServiceDescription = ({
  service,
}: {
  service: ServicesForUserProps | null;
}) => {
  if (service) {
    return (
      <div className="user__body__section service__description__section">
        <div className="service__description">
          <div className="services__section__header">
            <div className="section__header__content">
              <h3 className="services__header__title">{service.name}</h3>
              <p className="service__id">Public informations of your service</p>
            </div>
          </div>
          <div className="services__section__content description__content">
            <div className="service__description__header">
              <div className="service__description__pseudo__image">
                {service.picture ? (
                  <img src={service.picture} alt={service.name} />
                ) : (
                  service.name.charAt(0).toUpperCase()
                )}
              </div>
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
            </div>
            <div className="service__description">
              <p>{service.description || "No description provided."}</p>
            </div>

            <div className="service__informations">
              <div className="information__item">
                <span>Referential identifier: {service.id}</span>
              </div>
              <div className="information__item">
                <span>
                  Created on {new Date(service.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <button className="secondary-button" style={{
            width : "100%",
          }}>Edit Service</button>
        </div>
      </div>
    );
  }
};

export default ServiceDescription;
