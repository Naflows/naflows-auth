import type { ServicesForUserProps } from "../../../../../../types/ServicesForUserProps";
import '../../../../../../../public/root/pages/services/components/service-alerts.scss';




const ServiceAlerts = ({ service }: { service: ServicesForUserProps }) => {

  const hasAlerts = service && service.alerts && service.alerts.length > 0;


  return (


    hasAlerts && (
      <div className="user__body__section">
        <div className="service__alerts__section">
          <div className="alerts__content">
            {service && service.alerts && service.alerts.length > 0 && (
              service.alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`service__alert service__alert--${alert.type}`}
                >

                  {
                    ( alert.type === "error" || alert.type === "warning" ) && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                      </svg>
                    )
                  }

                  {
                    alert.type === "info" && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                      </svg>
                    )
                  }



                  <div className="alert__body">
                    <div className="alert__header">
                      <strong>{alert.title}</strong>
                      <div className="separator"></div>
                      <p>{alert.message}</p>
                    </div>
                    <p className="instructions">
                      {alert.instructions}
                    </p>
                  </div>
                  <button className="primary-button" onClick={() => {
                    window.location.href = alert.link || "#";
                  }}>
                    Take Action
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    )


  );
};

export default ServiceAlerts;