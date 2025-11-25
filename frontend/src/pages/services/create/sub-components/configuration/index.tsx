import { useEffect, useState } from "react";
import GlobalDisclaimer from "../../../../../global/components/GlobalDisclaimer";
import Switch from "../../../../../global/components/Switch";
import { fetchPlansFromNass } from "../../../../../scripts/pages/services/get/fetch-plans";
import { useNotification } from "../../../../../global/action-information/NotificationContent";
import ServiceCreationNetworkConfiguration from "./network-configuration";
import ServicesPlans from "./plans-configuration";

export interface ServiceConfigurationProps {
    plans: {
        id: number;
        name: string;
        description: string;
        price: number;
        features: { feature: string; icon: string }[]; // Updated to include icon
        type: "cloud" | "local";
        storage: number;
        RPS: number;
    },
    settings: {
        allow_public_registration: boolean;
    },
    config: {
        ip_address: string;
        dns: string;
    }
}


const ServiceConfiguration = ({
    serviceConfiguration,
    setServiceConfiguration
}: {
    serviceConfiguration: ServiceConfigurationProps;
    setServiceConfiguration: React.Dispatch<React.SetStateAction<ServiceConfigurationProps>>;
}) => {

    const [plans, setPlans] = useState<ServiceConfigurationProps["plans"][]>([]);
    const { addNotification } = useNotification();

    useEffect(() => {
        // Fetch available plans from the API or define them statically
        const fetchPlans = async () => {
            const plans = await fetchPlansFromNass();
            if (plans != undefined) {
                setPlans(plans);
                serviceConfiguration.plans = plans[0]; // Set default plan to the first one
            } else {
                addNotification({
                    type: "error",
                    title: "Error Fetching Plans",
                    description: "There was an error fetching the service plans. Please try again later."
                })
            }
        };
        fetchPlans();
    }, []); // Empty dependency array to run only once on mount

    return (

        <div className="services__creation__form">
            <GlobalDisclaimer
                title="Important: Service Configuration"
                message="Please ensure that the IP address and DNS you provide are accurate and reachable. Incorrect settings may lead to service downtime or connectivity issues."
                allowHidden={true}
            />
            <div className="form form__parts__separated">
                <div className="form__section row">
                    <div className="form__part">
                        <div className="form__part__header">
                            <h4>Network Configuration</h4>
                            <p>Specify the network settings for your service. These settings are crucial for ensuring that your service is accessible to users and other services. You will be able to add more IP addresses later.</p>
                        </div>
                        <ServiceCreationNetworkConfiguration
                            serviceConfiguration={serviceConfiguration}
                            setServiceConfiguration={setServiceConfiguration}
                        />
                    </div>
                    <div className="form__part">
                        <div className="form__part__header">
                            <h4>Service Settings</h4>
                            <p>Adjust the settings for your service to control its behavior and accessibility.</p>
                        </div>
                        <div className="form__content">
                            <Switch
                                label="Allow Public Registration"
                                checked={serviceConfiguration && serviceConfiguration.settings ? serviceConfiguration.settings.allow_public_registration : false}
                                description="Enable this option to allow users to register for your service without an invitation. This is useful for public services but may increase exposure to unwanted traffic."
                                onChange={(checked) => {
                                    if (serviceConfiguration && serviceConfiguration.settings && checked !== serviceConfiguration.settings.allow_public_registration) {
                                        setServiceConfiguration({
                                            ...serviceConfiguration,
                                            settings: {
                                                ...serviceConfiguration.settings,
                                                allow_public_registration: checked
                                            }
                                        });
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
                <ServicesPlans
                    plans={
                        plans
                    }
                    serviceConfiguration={serviceConfiguration}
                    setServiceConfiguration={setServiceConfiguration}
                />
            </div>
        </div>
    )
}

export default ServiceConfiguration;