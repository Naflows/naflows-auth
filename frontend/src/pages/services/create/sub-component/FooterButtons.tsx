import { useEffect, useState } from "react";
import type { ServiceCreationSteps } from "./HeaderButtons";
import CreateServiceHeaderButtons from "./HeaderButtons";


const servicesCreationsStep = {
    "disclaimer": "Service Creation Guidelines",
    "wizard-init": "Service Details",
    "wizard-configure": "Service Configuration",
    "wizard-payement": "Review & Create"
};


const ServiceCreationFooterButtons: React.FC<{
    setServiceCreationStep: React.Dispatch<React.SetStateAction<ServiceCreationSteps>>,
    nextConditionMet?: boolean,
    serviceCreationStep: ServiceCreationSteps
}> = ({
    setServiceCreationStep,
    serviceCreationStep,
    nextConditionMet
}) => {

        const [nextStep, setNextStep] = useState<string | null>(null);
        const [backStep, setBackStep] = useState<string | null>(null);

        useEffect(() => {
            const steps = Object.keys(servicesCreationsStep);
            const currentIndex = steps.indexOf(serviceCreationStep);
            setNextStep(currentIndex + 1 < steps.length ? steps[currentIndex + 1] : null);
            setBackStep(currentIndex - 1 >= 0 ? steps[currentIndex - 1] : null);
            console.log("Next Step:", nextStep, "Back Step:", backStep);

            window.scrollTo({ top: 0, behavior: "smooth" });
        }, [serviceCreationStep, nextStep, backStep]);

        return (
            <div className={` 
                nass__services__creation__footer
                ${!nextConditionMet ? "footer--next-inactive" : ""}
            `}>
                <div className="footer__header">
                    <button className="secondary-button width-fit" onClick={() => {
                        if (backStep) {
                            setServiceCreationStep(backStep as ServiceCreationSteps);
                        }
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                        </svg>
                    </button>
                    <CreateServiceHeaderButtons setServiceCreationStep={setServiceCreationStep} currentStep={serviceCreationStep} />
                </div>
                <div className="buttons-container">
                    <button className={`primary-button width-100-auto ${!nextConditionMet ? "inactive" : ""}`} onClick={() => {
                        if (nextConditionMet && nextStep) {
                            setServiceCreationStep(nextStep as ServiceCreationSteps);
                        }
                    }} disabled={!nextConditionMet}>Next</button>
                </div>
            </div>
        );
    };

export default ServiceCreationFooterButtons;
