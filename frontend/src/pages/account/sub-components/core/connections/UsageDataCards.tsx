import type { InformationKey } from "./PersonalDataInformation";
import personalDataInformations from "./PersonalDataInformation";

const UsageDataCards = ({
    usageData,
    setUsageData,
}: {
    usageData: InformationKey | null;
    setUsageData: (key: InformationKey) => void;
}) => {
  return (
    <div className="manage__details__info">
      <div className="manage__details__info__header">
        <h5 className="manage__details__info__title">Usage Data Access</h5>
        <p className="manage__details__info__description">
          Select the level of usage data this service can access.
        </p>
      </div>
      <div className="manage__cards">
        {Object.keys(personalDataInformations as Record<InformationKey, unknown>).map(
          (key: string) => {
            const value = personalDataInformations[key as InformationKey];
            return (
              <div
                key={key}
                className={`manage__card ${usageData === key ? "active" : ""}`}
                onClick={() => {
                  setUsageData(key as InformationKey);
                }}
              >
                <h6 className="manage__card__title">{value.title}</h6>
                <p className="manage__card__description">{value.description}</p>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default UsageDataCards;
