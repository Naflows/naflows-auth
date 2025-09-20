import type { ServicesForUserProps } from "../../../../types/ServicesForUserProps";

const ServiceStorage = ({
  service,
}: {
  service: ServicesForUserProps | null;
}) => {
  if (service) {
    return (
      <div className="user__body__section service__storage__section">
        <div className="service__storage">
          <div className="services__section__header">
            <div className="section__header__content">
              <h3 className="services__header__title">Service Storage</h3>
              <p>Overview of your current service storage capacity</p>
            </div>
          </div>
          <div className="services__section__content">
            <span className="service__storage__usage__text">
              {service.storage.used_space / 1024} out of {service.storage.size}{" "}
              GB used
            </span>
            <div className="service__storage__usage">
              <div
                className="storage__usage__bar"
                style={{
                  width: `${
                    (service.storage.used_space /
                      1024 /
                      parseInt(service.storage.size)) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ServiceStorage;
