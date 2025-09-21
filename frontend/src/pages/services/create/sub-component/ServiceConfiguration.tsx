import { useEffect, useState } from "react";
import Input from "../../../../global/components/Input";
import GlobalDisclaimer from "../../../../global/components/GlobalDisclaimer";
import Switch from "../../../../global/components/Switch";

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

const icons = {
    "token": "/public/assets/icons/token.svg",
    "analytics": "/public/assets/icons/analytics.svg",
    "community": "/public/assets/icons/community.svg",
    "users": "/public/assets/icons/users.svg",
    "support": "/public/assets/icons/support.svg",
    "integration": "/public/assets/icons/integration.svg",
    "security": "/public/assets/icons/security.svg",
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
                setPlans(data.data.plans)
                console.log("Plans state updated:", plans);
            } catch (error) {
                console.error("Error fetching plans:", error);
            }
        })();
    }, []);

    return (
        <div className="services__creation__form">
            <div className="services__creation__header">
                <h3>Service Configuration</h3>
                <p>
                    Configure the technical settings of your service, including IP address, DNS, and select a pricing plan that suits your needs. You can always update these settings later.
                </p>
            </div>
            <GlobalDisclaimer
                title="Important: Service Configuration"
                message="Please ensure that the IP address and DNS you provide are accurate and reachable. Incorrect settings may lead to service downtime or connectivity issues."
                allowHidden={true}
            />
            <div className="form form__parts__separated">
                <div className="form__part">
                    <div className="form__part__header">
                        <h4>Network Configuration</h4>
                        <p>Specify the network settings for your service. These settings are crucial for ensuring that your service is accessible to users and other services.</p>
                    </div>
                    <div className="form__content">
                        <div className="inputs__container two-columns">
                            <Input
                                label="Service IP Address"
                                type="text"
                                name="ip_address"
                                value={serviceConfiguration && serviceConfiguration.config ? serviceConfiguration.config.ip_address : ""}
                                autoComplete={false}
                                onChange={(e) => {
                                    const check = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                                    if (!check.test(e.target.value)) {
                                        console.log("Invalid IP address format");
                                        return;
                                    }
                                    if (serviceConfiguration) {
                                        setServiceConfiguration({
                                            ...serviceConfiguration,
                                            config: {
                                                ...serviceConfiguration.config,
                                                ip_address: e.target.value
                                            }
                                        });
                                    }
                                }}
                                required={true}
                            />
                            <Input
                                label="Service DNS"
                                type="text"
                                name="dns"
                                value={serviceConfiguration && serviceConfiguration.config ? serviceConfiguration.config.dns : ""}
                                onChange={(e) => {
                                    const check = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/;
                                    if (!check.test(e.target.value)) {
                                        console.log("Invalid DNS format");
                                        return;
                                    }
                                    if (serviceConfiguration) {
                                        setServiceConfiguration({
                                            ...serviceConfiguration,
                                            config: {
                                                ...serviceConfiguration.config,
                                                dns: e.target.value
                                            }
                                        });
                                    }
                                }}
                                required={true}
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
                <div className="form__part">
                    <div className="form__part__header">
                        <h4>Pricing Plan</h4>
                        <p>Select a pricing plan that best fits your service needs. You can change your plan at any time.</p>
                    </div>
                    <div className="form__content">
                        <div className="plans__container">
                            <div className="plans__content">
                                {plans.length === 0 ? (
                                    <p>Loading plans...</p>
                                ) : (
                                    plans.map((plan) => (
                                        <div key={plan.id} className={`plan__card ${serviceConfiguration.plans?.id === plan.id ? "selected" : ""}`} onClick={() => {
                                            setServiceConfiguration({
                                                ...serviceConfiguration,
                                                plans: plan
                                            });
                                        }}>
                                            <div className="plan__card__header">
                                                <div className="plan__card__header__title">
                                                    <div className="card__header__title__head">
                                                        <h4>{plan.name}</h4>
                                                        <p>{plan.description}</p>

                                                        <div className="plan__specs">
                                                            <span className="plan__spec">
                                                                {plan.price}€
                                                            </span>
                                                            <span className="plan__spec">
                                                                {plan.RPS} RPS
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <ul className="plan__features">
                                                {plan.features.map((feature, index) => (
                                                    <li key={index}>
                                                        <img src={icons[feature.icon as keyof typeof icons]} alt={feature.feature} className="feature-icon" />
                                                        <span>{feature.feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServiceConfiguration;