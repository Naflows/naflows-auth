import { useEffect } from "react";
import type { InformationKey } from "../../core/connections/PersonalDataInformation";




export function useHandleResize(
    detailledBodyRef: React.RefObject<HTMLDivElement | null>,
    setDetailledBodyHeight: React.Dispatch<React.SetStateAction<number | null>>,
    usageData: InformationKey | null
) {
    useEffect(() => {
        const element = detailledBodyRef.current;
        if (!element) return;

        const updateHeight = () => {
            setDetailledBodyHeight(element.scrollHeight);
        };

        updateHeight();

        const resizeObserver = new window.ResizeObserver(updateHeight);
        resizeObserver.observe(element);

        return () => {
            resizeObserver.disconnect();
        };
    }, [usageData]);

    useEffect(() => {
        const handleResize = () => {
            if (detailledBodyRef.current) {
                setDetailledBodyHeight(detailledBodyRef.current.scrollHeight);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

}