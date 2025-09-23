import type { ServiceConfigurationProps } from "./ServiceConfiguration";

const icons = {
    "token": "/public/assets/icons/token.svg",
    "analytics": "/public/assets/icons/analytics.svg",
    "community": "/public/assets/icons/community.svg",
    "users": "/public/assets/icons/users.svg",
    "support": "/public/assets/icons/support.svg",
    "integration": "/public/assets/icons/integration.svg",
    "security": "/public/assets/icons/security.svg",
    "storage": "/public/assets/icons/storage.svg",
}


const ServicesPlans = ({
    plans,
    serviceConfiguration,
    setServiceConfiguration
}: {
    plans: ServiceConfigurationProps["plans"][];
    serviceConfiguration: ServiceConfigurationProps;
    setServiceConfiguration: React.Dispatch<React.SetStateAction<ServiceConfigurationProps>>;
}) => {
    return (
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
                                <div key={plan.id} className={`plan__card ${serviceConfiguration.plans.id === plan.id ? "selected" : ""}`} onClick={() => {
                                    setServiceConfiguration({
                                        ...serviceConfiguration,
                                        plans: plan
                                    });
                                }}>
                                    <div className="plan__card__header">
                                        <div className="plan__card__header__title">
                                            <div className="card__header__title__head">
                                                <div className="card__header__text">
                                                    <h4>{plan.name}</h4>
                                                    <p>{plan.description}</p>
                                                </div>

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
    )
}

export default ServicesPlans;