import { useEffect, useState } from "react";
import Input from "../../../../global/components/Input";
import GlobalDisclaimer from "../../../../global/components/GlobalDisclaimer";
import Switch from "../../../../global/components/Switch";
import ServicesPlans from "./ServicesPlans";

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

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${process.env.DUMMY_API_URL_DEV}/public/data/plans.json`);
                const data = await res.json();
                setPlans(data.data.plans);
                serviceConfiguration.plans = data.data.plans[0]; // Set default plan to the first one
                console.log("Plans state updated:", plans);
            } catch (error) {
                console.error("Error fetching plans:", error);
            }
        })();
    }, []);

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
                        <div className="form__content">
                            <div className="inputs__container two-rows" style={{
                                display:"flex",
                                flexDirection:"row",
                                flexWrap:"wrap",
                                gap: 5
                            }}>
                                <Input
                                    label="Service IP Address"
                                    type="text"
                                    name="ip_address"
                                    value={serviceConfiguration && serviceConfiguration.config ? serviceConfiguration.config.ip_address : ""}
                                    autoComplete={false}
                                    fitContent={false}
                                    onChange={(value) => {
                                        if (serviceConfiguration) {
                                            setServiceConfiguration({
                                                ...serviceConfiguration,
                                                config: {
                                                    ...serviceConfiguration.config,
                                                    ip_address: value.toString().toLowerCase()
                                                }
                                            });
                                        }
                                    }}
                                    required={true}
                                    maxChar={15}
                                    displayMaxChar={true}
                                    errorMessage="Please enter a valid IP address."
                                    onError={(value) => {
                                        const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                                        return !ipRegex.test(value);
                                    }}
                                />
                                <Input
                                    label="Service DNS"
                                    type="text"
                                    name="dns"
                                    value={serviceConfiguration && serviceConfiguration.config ? serviceConfiguration.config.dns : ""}
                                    fitContent={false}
                                    onChange={(value) => {
                                        if (serviceConfiguration) {
                                            setServiceConfiguration({
                                                ...serviceConfiguration,
                                                config: {
                                                    ...serviceConfiguration.config,
                                                    dns: value.toString().toLowerCase()
                                                }
                                            });
                                        }
                                    }}
                                    required={true}
                                    errorMessage="Please enter a valid DNS."
                                    autoComplete={false}
                                    onError={(value) => {
                                        const dnsRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/;
                                        return !dnsRegex.test(value);
                                    }}
                                />
                            </div>
                        </div>
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