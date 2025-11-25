import type { ServiceConfigurationProps } from ".";
import { FeaturesIcon } from "./get-features-icons";



const plansHues: Record<string, string> = {
    "free": "hue-120",
    "pro": "hue-240",
    "enterprise": "hue-300"
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
                            plans.map((plan) => {
                                const isPlanSelected = serviceConfiguration.plans.id === plan.id;

                                return (
                                    <div key={plan.id} className={`plan__card  ${plansHues[plan.name.toLowerCase()]} ${isPlanSelected ? "selected" : ""}`} onClick={() => {
                                        setServiceConfiguration({
                                            ...serviceConfiguration,
                                            plans: plan
                                        });
                                    }}>
                                        <div className={`selected--info ${serviceConfiguration.plans.id === plan.id ? "visible" : ""}`} >
                                            <span>Selected</span>
                                        </div>
                                        <div className={`plan__card__bc`}></div>
                                        <div className="plan__body">
                                            <div className="plan__card__header">
                                                <div className="plan__card__header__title">
                                                    <div className="card__header__title__head">
                                                        <div className="card__header__text">
                                                            <h4>{plan.name.charAt(0) + plan.name.slice(1).toLowerCase()}</h4>
                                                            <p>Starting at {plan.price}€</p>
                                                        </div>

                                                        <div className="plan__specs">
                                                            <span className="plan__spec">
                                                                {plan.description}
                                                            </span>
                                                            <span className="plan__spec">
                                                                Limited at {plan.RPS} RPS - {plan.RPS * 1.5} Peak
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <ul className="plan__features">
                                                <li className="plan__features__title">
                                                    <strong>Features</strong>
                                                </li>
                                                {plan.features.map((feature, index) => (
                                                    <li key={index}>
                                                        <FeaturesIcon name={feature.icon} />
                                                        <span>{feature.feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServicesPlans;