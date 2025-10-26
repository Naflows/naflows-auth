
import { useEffect, useState } from "react";
import "../../../../public/root/pages/home/welcome-overlay.scss";

const WelcomeOverlay = () => {
    const launchDate = new Date("2026-02-28T00:00:00Z");
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const updateTimeLeft = () => {
            const now = new Date();
            const difference = launchDate.getTime() - now.getTime();
            if (difference <= 0) {
                setTimeLeft("Soon Launched!");
                return;
            }
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / (1000 * 60)) % 60);
            const seconds = Math.floor((difference / 1000) % 60);
            setTimeLeft(`${days} day${days > 1 ? "s" : ""} ${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${minutes > 1 ? "s" : ""} ${seconds} second${seconds > 1 ? "s" : ""}`);
        };

        updateTimeLeft();
        const intervalId = setInterval(updateTimeLeft, 1000);
        return () => clearInterval(intervalId);
    }, [])

    return (
        <div className="global__welcome__screen__overlay">
            {/* 
            The overlay is made of 3 differents parts :
            - On the left, the welcome message with a price
            - In the middle, the naflows logo
            - On the right, the action buttons (sign in / sign up) & details
        */}
            <div className="global__welcome__screen__overlay__left">
                <h1><span className="title highlight">Welcome to the NASS</span> <span className="subtitle">Naflows Authentication Secure System</span></h1>
                <p>Build efficient backend systems with Naflows thanks to open source & community support.</p>

                <div className="launch__countdown__container">
                    <div className="launch__countdown__container__body">
                        <span className="launch__countdown__label">The NASS will be officially launched on February 28th, 2026</span>
                        <span className="launch__countdown__value">{timeLeft} left</span>
                    </div>

                    <div className="launch__countdown__actions">
                        <button className="launch__countdown__action launch__countdown__action--primary primary-button width-100-auto">Sign In</button>
                        <button className="launch__countdown__action launch__countdown__action--secondary secondary-button" onClick={() => {
                            window.location.href = "https://discord.gg/5k8aFS9DbK"
                        }}>Join Beta</button>
                    </div>
                </div>
            </div>

        </div>
    )
};

export default WelcomeOverlay;