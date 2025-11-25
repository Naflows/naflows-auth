import type { AlertContentProps } from "../../../../types/AlertContentProps.type";
import ServiceCreationDisclaimer from "../sub-components/disclaimer";
import type { ServiceCreationSteps } from "../sub-components/footer/HeaderButtons";
import type { ServiceConfigurationProps } from "../sub-components/configuration";
import type { ServiceDescriptionProps } from "../sub-components/service-details";
import CreateServiceDescription from "../sub-components/service-details";
import { createServiceToNass } from "../../../../scripts/pages/services/create-service";
import ServiceConfiguration from "../sub-components/configuration";
import ServiceCreationFooterButtons from "../sub-components/footer";




export const getSwitchStep = ({
    serviceCreationStep,
    guidelinesAccepted,
    setServiceCreationStep,
    setDisplayAlert,
    serviceDescription,
    serviceConfiguration,
    setGuidelinesAccepted,
    setServiceDescription,
    setServiceConfiguration
}: {
    serviceCreationStep: ServiceCreationSteps;
    guidelinesAccepted: boolean;
    setServiceCreationStep: React.Dispatch<React.SetStateAction<ServiceCreationSteps>>;
    setDisplayAlert: React.Dispatch<React.SetStateAction<AlertContentProps>>;
    serviceDescription: ServiceDescriptionProps;
    serviceConfiguration: ServiceConfigurationProps ;
    setGuidelinesAccepted: React.Dispatch<React.SetStateAction<boolean>>;
    setServiceDescription: React.Dispatch<React.SetStateAction<ServiceDescriptionProps>>;
    setServiceConfiguration: React.Dispatch<React.SetStateAction<ServiceConfigurationProps>>;
}) => {

    switch (serviceCreationStep) {
        case "disclaimer":
            return (
                <div key={"disclaimer-header"} className="services__creation__body">
                    <ServiceCreationDisclaimer setGuidelinesAccepted={setGuidelinesAccepted} guidelinesAccepted={guidelinesAccepted} />
                    <button className={`primary-button width-100-auto ${guidelinesAccepted ? "active" : "inactive"}`} disabled={!guidelinesAccepted} onClick={() => {
                        if (guidelinesAccepted) {
                            setServiceCreationStep("wizard-init");
                        }
                    }}>Proceed</button>
                </div>
            )
        case "wizard-init":
            return (
                <div key={"wizard-init"} className="services__creation__body">
                    <CreateServiceDescription serviceDescription={serviceDescription} setServiceDescription={setServiceDescription} />
                    <ServiceCreationFooterButtons serviceCreationStep={serviceCreationStep} setServiceCreationStep={setServiceCreationStep} nextConditionMet={serviceDescription?.name != "" && serviceDescription?.description != "" && serviceDescription?.profileImage != "" && serviceDescription?.bannerImage != ""} />
                </div>
            )
        case "wizard-configure":
            return (
                <div key={"wizard-configure"} className="services__creation__body">
                    <ServiceConfiguration serviceConfiguration={serviceConfiguration} setServiceConfiguration={setServiceConfiguration} />
                    <ServiceCreationFooterButtons serviceCreationStep={serviceCreationStep} setServiceCreationStep={setServiceCreationStep} nextConditionMet={
                        serviceConfiguration.config.ip_address !== "" &&
                        serviceConfiguration.config.dns !== ""
                    } />
                </div>
            )
        case "wizard-review":
            createServiceToNass({
                serviceDescription,
                serviceConfiguration,
                setDisplayAlert
            });
            break;
        default:
            createServiceToNass({
                serviceDescription,
                serviceConfiguration,
                setDisplayAlert
            });;
    }
}