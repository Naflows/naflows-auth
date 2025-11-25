
export type ServiceCreationSteps = "disclaimer" | "wizard-init" | "wizard-configure" | "wizard-review";

const servicesCreationsStep: Record<ServiceCreationSteps, string> = {
    "disclaimer": "Service Creation Guidelines",
    "wizard-init": "Service Details",
    "wizard-configure": "Service Configuration",
    "wizard-review": "Review & Create"
};

const NextStepIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" /></svg>
)

const CreateServiceHeaderButtons = ({
    setServiceCreationStep,
    currentStep
}: {
    setServiceCreationStep: React.Dispatch<React.SetStateAction<ServiceCreationSteps>>,
    currentStep: ServiceCreationSteps
}) => {

    return (
        <div className="services__creation__header__step">
            {
                /* Iterate through servicesCreationsStep and create a button for each step */
                Object.entries(servicesCreationsStep).map(([stepKey, stepLabel]) => {
                    const keyIndex = Object.keys(servicesCreationsStep).indexOf(stepKey);
                    const isActive = keyIndex <= Object.keys(servicesCreationsStep).indexOf(currentStep);
                    const hasNext = keyIndex + 1 < Object.keys(servicesCreationsStep).length;

                    return (
                        <>
                            <button
                                key={stepLabel}
                                onClick={() => setServiceCreationStep(stepKey as ServiceCreationSteps)}
                                className={`tertiary-button ${isActive ? "" : "inactive"}`}
                            >
                                <span>{stepLabel}</span>
                            </button>
                            {
                                hasNext && <NextStepIcon />
                            }</>
                    )
                })
            }
        </div>
    );
}

export default CreateServiceHeaderButtons;
