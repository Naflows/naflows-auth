import axios from "axios";
import { useEffect } from "react";

export interface ServiceStatus {
  data: {
    memory: { usagePercent: string };
    cpu: { load: number; model: string; cores: number };
    disk: { usagePercent: string };
    software: {
      version: string;
      environment: string;
      platform: string;
      architecture: string;
      name: string;
      author: string;
    };
  };
  status: number;
  message: string;
}

const Status = ({
  serviceStatus,
  setServiceStatus,
}: {
  serviceStatus: ServiceStatus | null;
  setServiceStatus: (status: ServiceStatus | null) => void;
}) => {

  useEffect(() => {
    const fetchStatus = () => {
      axios
        .get(`${process.env.DUMMY_API_URL_DEV}/public/status-check`)
        .then((response) => {
          if (response.status === 200) {
            console.log("Service status fetched:", response.data);
            setServiceStatus(response.data);
          } else {
            setServiceStatus(null);
          }
        })
        .catch(() => {
          setServiceStatus(null);
        });
    };

    fetchStatus(); // Initial fetch

    const intervalId = setInterval(fetchStatus, 15000); // Repeat every 15s

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [setServiceStatus]);

  return (
    <div
      className={`nass_service__informations  ${serviceStatus && serviceStatus.status == 200
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
            {serviceStatus && serviceStatus.status == 200 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path d="M440-91 160-252q-19-11-29.5-29T120-321v-318q0-22 10.5-40t29.5-29l280-161q19-11 40-11t40 11l280 161q19 11 29.5 29t10.5 40v318q0 22-10.5 40T800-252L520-91q-19 11-40 11t-40-11Zm0-366v274l40 23 40-23v-274l240-139v-42l-43-25-237 137-237-137-43 25v42l240 139Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path d="M480-526 243-663l-43 25v42l280 162 280-162v-42l-43-25-237 137ZM440-91 160-252q-19-11-29.5-29T120-321v-318q0-22 10.5-40t29.5-29l280-161q19-11 40-11t40 11l280 161q19 11 29.5 29t10.5 40v186q-27-13-57.5-20t-62.5-7q-116 0-198 82t-82 198q0 32 6.5 61.5T466-82q-7-2-13.5-3.5T440-91Zm280 11q8 0 14-6t6-14q0-8-6-14t-14-6q-8 0-14 6t-6 14q0 8 6 14t14 6Zm-20-80h40v-160h-40v160ZM720 0q-83 0-141.5-58.5T520-200q0-83 58.5-141.5T720-400q83 0 141.5 58.5T920-200q0 83-58.5 141.5T720 0Z" />
              </svg>
            )}
            <span id="version__value"> V.{serviceStatus?.data.software.version}</span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Status;
