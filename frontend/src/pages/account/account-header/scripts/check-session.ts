import axios from "axios";
import { useEffect } from "react";

const useSessionValid = () => {
    const x = 60; // seconds - normally 60
    const y = 60;

    useEffect(() => {
        let intervalId: number | null = null;
        const timeoutId = window.setTimeout(() => {
            intervalId = window.setInterval(async () => {
                try {
                    const response = await axios.post(`${process.env.DUMMY_API_URL_DEV}/client/secure/session-check`, {}, {
                        withCredentials: true
                    });
                    console.log("Session validity response:", response.data);
                    if (!response.status || response.status !== 200) {
                        window.location.href = "/login?form=login&reason=outdated-session&redirect=" + window.location.pathname;
                    }
                } catch (error) {
                    console.error("Error checking session validity:", error);
                    window.location.href = "/login?form=login&reason=outdated-session&redirect=" + window.location.pathname;
                }
            }, x * 1000);
        }, y * 1000); // wait 60s before starting the periodic check

        return () => {
            window.clearTimeout(timeoutId);
            if (intervalId !== null) {
                window.clearInterval(intervalId);
            }
        };
    }, []);
}

export default useSessionValid;