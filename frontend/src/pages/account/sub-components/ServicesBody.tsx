import type { ServicesBodyProps } from "../../../types/ServicesBodyProps";

const BasicServiceBody = ({ service }: { service: ServicesBodyProps }) => {
  const joinedDate = new Date(service.joined_at);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - joinedDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="service__view__body">
      <div className="service__view__body__header">
        <div className="services__body__header__content">
          <span className={`service__status ${service.active.toLowerCase()}`}>
            <div className="service__status__pastille"></div>
          </span>
          <h5 className="service__name">
            <span>{service.name}</span>
          </h5>
        </div>
        <a
          href={`https://${service.domain}`}
          target="_blank"
          rel="noopener noreferrer"
          className="service__domain tertiary-button"
        >
          https://{service.domain}
        </a>
      </div>
      <div className="service__view__informations">
        <div className="service__view__info__section">
          <h5 className="service__info__title">Account Link Status </h5>
          <p className={`service__info__value ${service.active ? "connected" : "disconnected"}`}>{service.active ? "Connected" : "Disconnected"}</p>
        </div>
        <div className="service__view__info__section">
          <h5 className="service__info__title">Joined on</h5>
          <p className="service__info__value">{joinedDate.toLocaleDateString()} ({diffDays} day{diffDays > 1 ? "s" : ""} ago)</p>
        </div>
      </div>
    </div>
  );
};

export default BasicServiceBody;
