import type { ServicesForUserProps } from "../../../../types/ServicesForUserProps";
import "../../../../../public/root/pages/services/manage/sub-components/ServiceDescription.scss";
import Input from "../../../../global/components/Input";

const SettingsComponent = ({
  name,
  value,
  description,
  disabled = false,
}: {
  name: string;
  value: boolean;
  description: string;
  disabled?: boolean;
}) => {
  return (
    <div className={`settings__content ${disabled ? "disabled" : ""}`}>
      <div className="setting__title">
        <span className="setting__name">{name}</span>
        <span className="setting_description">
          {description}
        </span>
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
        <div className="service__public__settings ">
          <div className="service__actions__field no-padding">
            <div className="service__actions__field__header">
              <h3 className="service__actions__field__title">Service Settings</h3>
              <p>Overview of your current service settings</p>
            </div>
          </div>
          <div className="services__settings__view">
            <div className="information__item" style={{
              maxWidth: '100%'
            }}>
              <Input
                label="Referential Identifier"
                value={service.id}
                editMode={false}
                allowCopy={true}
                type="text"
                name="service-id"
                required={false}
                onChange={() => { }}
              />
            </div>
            <SettingsComponent
              name="Allow user registration"
              description="Allow users to register for this service"
              value={service.public_settings.allow_user_registration}
            />
            <SettingsComponent
              description="Make this service publicly visible on your profile"
              name="Allow public visibility"
              value={service.public_settings.allow_public_visibility}
            />
            <SettingsComponent
              name="Allow service connections"
              description="Allow other Naflows services to connect to this service"
              value={service.public_settings.allow_service_connections}
              disabled={true}
            />
            <SettingsComponent
              description="Allow users to use Naflows Payement System for subscriptions"
              name="Naflows Payement System"
              value={service.settings.allow_nass_payement_method}
              disabled={true}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default ServicePublicSettings;
