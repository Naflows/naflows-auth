import { useState } from "react";
import type { ServiceStatus } from "../../../../types/ServiceStatus.type";
import { useFetchStatus } from "./use/useFetch";
import { useSetActive } from "./use/useSetActive";
import { StatusActivitySVG } from "./sub-components/activity-svg";

const Status = ({
  serviceStatus,
  setServiceStatus,
}: {
  serviceStatus: ServiceStatus | null;
  setServiceStatus: (status: ServiceStatus | null) => void;
}) => {
  const [active, setActive] = useState<boolean>(false);
  useSetActive({ setActive, serviceStatus });
  useFetchStatus({ setServiceStatus });

  return (
    <div
      className={`nass_service__informations  ${active
          ? "nass_service__info__item__value--active"
          : "nass_service__info__item__value--inactive"
        }`}
    >
      <div
        className={`nass_service__info__item`}
        data-tooltip="Current status of the NASS service"
      >
        <div className="nass_service__info__header">
          <div className={`nass_service__info__item__value`}>
            <StatusActivitySVG active={active} />
            <span id="version__value" style={{
              display: serviceStatus && serviceStatus.disk.usagePercent ? 'inline' : 'none'
            }}> V.{serviceStatus?.software.version}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
