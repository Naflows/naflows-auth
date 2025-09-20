import type { ServiceCreationSteps } from "./HeaderButtons";



const ServiceCreationFooterButtons: React.FC<{
    setServiceCreationStep: React.Dispatch<React.SetStateAction<ServiceCreationSteps>>,
}> = ({
    setServiceCreationStep 
}) => {
        return (
            <div className="buttons-container">
                <button className="secondary-button width-100-auto" onClick={() => setServiceCreationStep("disclaimer")}>Back</button>
                <button className="primary-button width-100-auto" onClick={() => alert("Service creation wizard is not yet implemented.")}>Next</button>
            </div>
        );
    };

export default ServiceCreationFooterButtons;
