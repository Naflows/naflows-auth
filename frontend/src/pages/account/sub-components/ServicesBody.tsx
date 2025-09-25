import type { ServicesBodyProps } from "../../../types/ServicesBodyProps";
import type { ServicesCompleteBodyProps } from "../../../types/ServicesCompleteProps";

const BasicServiceBody = ({ service }: { service: ServicesBodyProps | ServicesCompleteBodyProps }) => {
  const joinedDate = new Date(service.joined_at);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - joinedDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  console.log(">>>> service", service);

  return (
    <div className="service__view__body">
      <img src={service.banner} alt={`${service.name} Banner`} className="service__view__banner" style={{ display: service.banner ? 'block' : 'none' }} />
      <div className="service__view__body__public">
        <img src={service.picture} alt={`${service.name} Logo`} className="service__view__logo" style={{ display: service.picture ? 'block' : 'none' }} />
        <div className="service__view__body__public__content">
          <div className="service__view__body__header">
            <div className="services__body__header__content">
              <span className={`service__status ${service.status.toLowerCase()}`}>
                <div className="service__status__pastille"></div>
              </span>
              <h5 className="service__name">
                <span>{service.name}</span>
              </h5>
            </div>
            <a
              href={`https://${service.dns}`}
              target="_blank"
              rel="noopener noreferrer"
              className="service__domain tertiary-button"
            >
              https://{service.dns}
            </a>
          </div>

          <div className="service__view__informations">
            <div className="service__view__info__section">
              <h5 className="service__info__title">Account Link Status </h5>
              <p className={`service__info__value ${service.user_active ? "connected" : "disconnected"}`}>{service.user_active ? "Connected" : "Disconnected"}</p>
            </div>
            <div className="service__view__info__section">
              <h5 className="service__info__title">Joined on</h5>
              <p className="service__info__value">{joinedDate.toLocaleDateString()} ({diffDays} day{diffDays > 1 ? "s" : ""} ago)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicServiceBody;
