
import "../../../../../public/root/pages/home/welcome-overlay.scss";
import type { ServiceStatus } from "../../../../types/ServiceStatus.type";
import Mailing from "../Mailing";

const WelcomeOverlay = ({
    serviceStatus
}: {
    serviceStatus: ServiceStatus | null;
}) => {


    return (
        <div className="global__welcome__screen__overlay">
            {/* 
            The overlay is made of 3 differents parts :
            - On the left, the welcome message with a price
            - In the middle, the naflows logo
            - On the right, the action buttons (sign in / sign up) & details
        */}

            <div className="global__welcome__screen__overlay__left">
                <h1>
                    <span className="welcome-text">Welcome to the</span>
                    <span className="title highlight">NASS</span>
                    <span className="subtitle">Naflows Authentication Secure System</span>
                </h1>
                <p>An advanced backend authentication system for your applications.</p>
            <div className="nass_home__activity">
                {serviceStatus != null && <Mailing />}
            </div>
            </div>



            {/* <div className="global__welcome__screen__overlay__right">
                <h2 className="installation__title">Get started with NASS in seconds</h2>

                <div className="steps">
                    <WelcomeOverlayStepButton stepNumber={1} description="Create your Naflows account" subdescription="Sign up for a free account to get started." />
                    <WelcomeOverlayStepButton stepNumber={2} description="Set up your NASS project in the Naflows dashboard" subdescription="Follow the instructions in the dashboard to create a new project." />
                    <WelcomeOverlayStepButton stepNumber={3} description="Install the NASS connection package" subdescription="Use npm to install the package in your project." />
                </div>
            </div> */}

        </div>
    )
};

export default WelcomeOverlay;