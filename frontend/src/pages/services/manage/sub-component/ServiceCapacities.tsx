import type { ServicesForUserProps } from "../../../../types/ServicesForUserProps";

const ServiceCapacities = ({
  service,
}: {
  service: ServicesForUserProps | null;
}) => {
  if (service) {
    return (
      <div className="user__body__section service__plans">
        <div className="service__plan">
          <div className="services__section__header">
            <div className="section__header__content">
              <h3 className="services__header__title">Service Capacities</h3>
              <p>Overview of your current service capacities</p>
            </div>
          </div>
          <div className="services__section__content  plans__table">
            <div className="table__content">
              <div className="table__header">Storage Size</div>
              <div className="table__value">{service.plan.size}</div>
            </div>
            <div className="table__content">
              <div className="table__header">RPS</div>
              <div className="table__value">{service.settings.rates}</div>
            </div>
            <div className="table__content">
              <div className="table__header">Service Plan</div>
              <div className="table__value">{service?.plan.plan}</div>
            </div>
            <div className="table__content">
              <div className="table__header">Storage Type</div>
              <div className="table__value">{service?.plan.type}</div>
            </div>
          </div>
          <button className="primary-button">Change Capacities</button>
        </div>
      </div>
    );
  }
};

export default ServiceCapacities;
