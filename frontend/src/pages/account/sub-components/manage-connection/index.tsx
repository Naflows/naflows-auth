import { useEffect, useRef, useState } from "react";
import type { ServicesCompleteBodyProps } from "../../../../types/ServicesCompleteProps";
import UsageDataCards from "../core/connections/UsageDataCards";
import type { InformationKey } from "../core/connections/PersonalDataInformation";
import { dataPreferences, type DataKeys } from "../core/connections/PersonalInformations";
import ServiceDescription from "../../../services/manage/sub-component/ServiceDescription";
import { useHandleResize } from "./methods/useHandleResize";


type SensitiveDataKeys = "ACCOUNT SECURITY MEASURES" | "BILLING DETAILS";
const sensitiveDataPreferences: Record<
  SensitiveDataKeys,
  { title: string; description: string }
> = {
  "ACCOUNT SECURITY MEASURES": {
    title: "Account Security Measures",
    description:
      "View and use your account security measures (e.g., two-factor authentication).",
  },
  "BILLING DETAILS": {
    title: "Billing Details",
    description: "View and use your billing details.",
  },
};

const ManageServiceConnection = ({
  service
}: {
  service: ServicesCompleteBodyProps | null
}) => {
  const [usageData, setUsageData] = useState<InformationKey | null>(null);
  const [personalData, setPersonalData] = useState<DataKeys[] | null>([]);
  const detailledBodyRef = useRef<HTMLDivElement | null>(null);
  const [detailledBodyHeight, setDetailledBodyHeight] = useState<number | null>(
    null
  );
  const [newService, setNewService] = useState<ServicesCompleteBodyProps | null>(service);

  useEffect(() => {
    if (service) {
      setNewService(service);
    }
  }, [service]);

  useHandleResize(
    detailledBodyRef,
    setDetailledBodyHeight,
    usageData
  );


  useEffect(() => {
    setUsageData(
      newService &&
      (newService.data_preferences.usage_data as InformationKey | null)
    );
    setPersonalData(
      newService && (newService.data_preferences.personal_data as DataKeys[])
    );
  }, [newService]);

  useEffect(() => {
    if (service === null) {
      setNewService(null);
      setUsageData(null);
      setPersonalData([]);
    }
  }, [service]);

  const updatePersonalData = (
    newPersonalData: DataKeys[] | SensitiveDataKeys[]
  ) => {
    if (newService) {
      setNewService({
        ...newService,
        data_preferences: {
          ...newService.data_preferences,
          personal_data: newPersonalData,
        },
      });
    }
  };

  if (newService != null && service != null) {
    return (
      <div className="manage__connection">
        <div className="manage__connection__body">
          <div className="manage__service__connection">
            <div className="manage__service__connection__header">
              <div className="manage__service__back">
                <button className="tertiary-button" onClick={() => {
                  window.location.href = `/account/services`;
                }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#e3e3e3"
                  >
                    <path d="m432-480 156 156q11 11 11 28t-11 28q-11 11-28 11t-28-11L348-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 28-11t28 11q11 11 11 28t-11 28L432-480Z" />
                  </svg>
                  <span>Back to services</span>
                </button>
              </div>
              <ServiceDescription service={service} publicDisplay={true} />

            </div>

            <div className="manage__service__actions">
              <button className="primary-button">
                {service.user_active
                  ? "Disconnect my account"
                  : "Connect my account"}
              </button>
              <button className="primary-button">Revoke service access</button>
              <button className="secondary-button">Report abuse</button>
            </div>
          </div>
          <div className="manage__service__details">
            <div className="service__details__header">
              <h3 className="manage__details__title">Data Preferences</h3>
              <p className="manage__details__description">
                Manage the data access preferences for this service.
              </p>
            </div>
            <div className="save__content__button" style={{
              display:
                JSON.stringify(
                  newService.data_preferences.personal_data
                ) !==
                  JSON.stringify(service.data_preferences.personal_data) ||
                  usageData !== service.data_preferences.usage_data
                  ? "block"
                  : "none",
            }}>
              <button
                className="primary-button save__changes__button"
              >
                Save Changes
              </button>
            </div>
            <div className="manage__details__body">
              <UsageDataCards
                usageData={usageData}
                setUsageData={setUsageData}
              />
              <div
                className="details__body__content"
                ref={detailledBodyRef}
                style={{
                  height:
                    usageData !== "FULL" ? "0px" : `${detailledBodyHeight}px`,
                  opacity: usageData !== "FULL" ? 0 : 1,
                }}
              >
                <div
                  className={`manage__details__info ${usageData !== "FULL" ? "disabled" : ""
                    }`}
                >
                  <div className="manage__details__info__header">
                    <h5 className="manage__details__info__title">
                      Personal Data Access
                    </h5>
                    <p className="manage__details__info__description">
                      Select the level of personal data this service can access.
                    </p>
                  </div>
                  <div className="manage__personal__data__options">
                    {Object.keys(dataPreferences).map((key) => {
                      const { title, description } =
                        dataPreferences[key as DataKeys];
                      return (
                        <div
                          key={key}
                          className={`manage__personal__data__option ${newService.data_preferences.personal_data.includes(
                            key as DataKeys
                          )
                            ? "selected"
                            : ""
                            }`}
                          onClick={() => {
                            // Add or remove the key from personalData
                            if (personalData) {
                              if (personalData.includes(key as DataKeys)) {
                                // Remove it
                                const newData = personalData.filter(
                                  (item) => item !== key
                                );
                                updatePersonalData(newData);
                              } else {
                                // Add it
                                const newData = [
                                  ...personalData,
                                  key as DataKeys,
                                ];
                                updatePersonalData(newData);
                              }
                            }
                          }}
                        >
                          <h6 className="manage__personal__data__option__title">
                            {title}
                          </h6>
                          <p className="manage__personal__data__option__description">
                            {description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div
                  className={`manage__details__info ${usageData !== "FULL" ? "disabled" : ""
                    }`}
                >
                  <div className="manage__details__info__header">
                    <h5 className="manage__details__info__title">
                      Sensitive Data Access
                    </h5>
                    <p className="manage__details__info__description">
                      Select the level of sensitive data this service can
                      access. These are disabled by default. Make sure the
                      service really needs this data, and is trustworthy.
                    </p>
                  </div>
                  <div className="manage__personal__data__options">
                    {Object.keys(sensitiveDataPreferences).map((key) => {
                      const { title, description } =
                        sensitiveDataPreferences[
                        key as "ACCOUNT SECURITY MEASURES" | "BILLING DETAILS"
                        ];
                      return (
                        <div
                          key={key}
                          className={`manage__personal__data__option ${newService.data_preferences.personal_data.includes(
                            key as DataKeys
                          )
                            ? "selected"
                            : ""
                            } disabled`}
                          onClick={() => {
                            // Add or remove the key from personalData
                            if (personalData) {
                              if (personalData.includes(key as DataKeys)) {
                                // Remove it
                                const newData = personalData.filter(
                                  (item) => item !== key
                                );
                                updatePersonalData(newData);
                              } else {
                                // Add it
                                const newData = [
                                  ...personalData,
                                  key as DataKeys,
                                ];
                                updatePersonalData(newData);
                              }
                            }
                          }}
                        >
                          <h6 className="manage__personal__data__option__title">
                            {title}
                          </h6>
                          <p className="manage__personal__data__option__description">
                            {description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ManageServiceConnection;
