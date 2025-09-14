import type { ServicesForUserProps } from "../../../types/ServicesForUserProps";
import "../../../../public/root/pages/services/manage/sub-components/ServiceDescription.scss";

const SettingsComponent = ({
  name,
  value,
}: {
  name: string;
  value: boolean;
}) => {
  return (
    <div className="settings__content">
      <div className="setting__title">
        <span>{name}</span>
      </div>
      <div className={`setting__value ${value ? "enabled" : "disabled"}`}>
        {value ? "Enabled" : "Disabled"}
      </div>
    </div>
  );
};

const ServicePublicSettings = ({
  service,
}: {
  service: ServicesForUserProps | null;
}) => {
  if (service) {
    return (
      <div className="user__body__section service__public__settings">
        <div className="service__public__settings">
          <div className="services__section__header">
            <div className="section__header__content">
              <h3 className="services__header__title">Service Settings</h3>
              <p>Overview of your current service settings</p>
            </div>
          </div>
          <div className="services__settings__view">
            <SettingsComponent
              name="Allow service connections"
              value={service.public_settings.allow_service_connections}
            />
            <SettingsComponent
              name="Allow user registration"
              value={service.public_settings.allow_user_registration}
            />
            <SettingsComponent
              name="Allow public visibility"
              value={service.public_settings.allow_public_visibility}
            />
            <SettingsComponent
              name="Naflows Payement System"
              value={service.settings.allow_nass_payement_method}
            />
          </div>
        </div>
        <button className="secondary-button" style={{
            width : "100%",
        }}>Manage Settings</button>
      </div>
    );
  }
};

export default ServicePublicSettings;
