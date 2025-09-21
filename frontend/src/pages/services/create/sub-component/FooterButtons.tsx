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
            <div className="nass__services__creation__footer">
                <CreateServiceHeaderButtons setServiceCreationStep={setServiceCreationStep} currentStep={serviceCreationStep} />
                <div className="buttons-container">
                    <button className="secondary-button width-100-auto" onClick={() => {
                        if (backStep) {
                            setServiceCreationStep(backStep as ServiceCreationSteps);
                        }
                    }}>Back</button>
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
