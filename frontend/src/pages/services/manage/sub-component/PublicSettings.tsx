import type { ServicesForUserProps } from "../../../../types/ServicesForUserProps";
import "../../../../../public/root/pages/services/manage/sub-components/ServiceDescription.scss";



const ServicePublicSettings = ({
  service,
}: {
  service: ServicesForUserProps | null;
}) => {
  if (service) {
    return (
      <div className="user__body__section service__public__settings">
        <div className="service__actions__field ">
          <div className="service__actions__field no-padding">
            <div className="service__actions__field__header">
              <h3 className="service__actions__field__title">Service Settings</h3>
              <p>Overview of your current service settings</p>
            </div>
          </div>
          <button className="primary-button">
            <span>Public Settings</span>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z"/></svg>
          </button>
        </div>
      </div>
    );
  }
};

export default ServicePublicSettings;
