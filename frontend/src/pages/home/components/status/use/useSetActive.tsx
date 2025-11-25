import { useEffect } from "react";

export const useSetActive = ({
    setActive,
    serviceStatus
}: {
    setActive: (active: boolean) => void;
    serviceStatus: import("../../../../../types/ServiceStatus.type").ServiceStatus | null;
}) => {
    useEffect(() => {
        if (serviceStatus && serviceStatus.disk.usagePercent) {
            setActive(true);
        } else {
            setActive(false);
        }
    }, [serviceStatus])
}

