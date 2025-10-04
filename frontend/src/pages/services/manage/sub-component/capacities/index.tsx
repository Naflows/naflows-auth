import type { ServicesForUserProps } from "../../../../../types/ServicesForUserProps";
import { PlanSvgs } from "./components/planSvgs";

const ServiceCapacities = ({
  service,
}: {
  service: ServicesForUserProps | null;
}) => {
  if (service) {
    return (
      <div className="user__body__section service__plans">
        <div className="service__plan">
          <div className="service__plan__body">
            <div className="plan__tags">
              <div className="plan__tag" id={service?.plan.plan}>
                <PlanSvgs plan={service?.plan.plan} />
                
                <span>{service?.plan.plan.charAt(0).toUpperCase() + service?.plan.plan.slice(1).toLocaleLowerCase()}</span>
              </div>
              <div className="plan__tag" id={service?.plan.type}>
                {
                  service?.plan.type === "CLOUD" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H260Z"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M260-160q-92 0-156-64T40-380q0-77 47.5-137T210-594q3-8 6-15.5t6-16.5L84-764q-11-11-11-28t11-28q11-11 28-11t28 11l680 680q11 11 11.5 27.5T820-84q-11 11-27.5 11.5T764-83l-78-77H260Zm604-50L322-751q35-24 74.5-36.5T480-800q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 39-15 72.5T864-210Z"/></svg>
                  )
                }
                <span>{service?.plan.type.charAt(0).toUpperCase() + service?.plan.type.slice(1).toLocaleLowerCase()}</span>
              </div>
            </div>
            <div className="service__storage">
              <span className="service__storage__usage__text">
                {Math.round((service.plan.used_space / 1024 / parseInt(service.plan.size || "0")) * 100)}%
              </span>
              <div className="service__storage__usage">
                <div
                  className="storage__usage__bar"
                  style={{
                    width: `${(service.plan.used_space /
                      1024 /
                      parseInt(service.plan.size || "0")) *
                      100
                      }%`,
                  }}
                ></div>
              </div>
            </div>
            <span className="rps__limitation">Limited to {service.settings.rates} rps. <a href="https://nass.naflows.com/docs/rates">Learn more.</a></span>
          </div>
        </div>
      </div>
    );
  }
};

export default ServiceCapacities;
