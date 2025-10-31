import Switch from "../../../../global/components/Switch";
import type { ServicesBodyProps } from "../../../../types/ServicesBodyProps";


const TermsAndRequirements = ({
    service,
    acceptedRequirements,
    setAcceptedRequirements,
}: {
    service: ServicesBodyProps | null;
    acceptedRequirements: {
        terms_of_service: boolean;
        privacy_policy: boolean;
        data_share: boolean;
    };
    setAcceptedRequirements: (requirements: {
        terms_of_service: boolean;
        privacy_policy: boolean;
        data_share: boolean;
    }) => void;
}) => {
    return (
        <div className="service__connection__detail__body">
            <div className="service__actions__field__header">
                <h3 className="service__actions__field__title">
                    <span>
                        Terms and Requirements
                    </span>
                </h3>
                <p>Please read and accept the following terms to continue.</p>
            </div>
            <div className="service__connection__details__content requirements">
                <div className="switch__content">
                    <Switch
                        label="I accept the terms of service."
                        checked={acceptedRequirements.terms_of_service}
                        onChange={(checked) => {
                            if (checked != acceptedRequirements.terms_of_service) {
                                setAcceptedRequirements({
                                    ...acceptedRequirements,
                                    terms_of_service: checked,
                                });
                            }
                        }}
                        mandatory={true}
                        description="I have read and agree to the service's terms of service."
                    />
                    <button className="primary-button" onClick={() => {
                        window.open(service?.public?.terms_of_service_url || "https://www.naflows.com/legal/privacy-policy", "_blank");
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240q17 0 28.5 11.5T480-800q0 17-11.5 28.5T440-760H200v560h560v-240q0-17 11.5-28.5T800-480q17 0 28.5 11.5T840-440v240q0 33-23.5 56.5T760-120H200Zm560-584L416-360q-11 11-28 11t-28-11q-11-11-11-28t11-28l344-344H600q-17 0-28.5-11.5T560-800q0-17 11.5-28.5T600-840h200q17 0 28.5 11.5T840-800v200q0 17-11.5 28.5T800-560q-17 0-28.5-11.5T760-600v-104Z" /></svg>
                    </button>
                </div>
                <div className="switch__content">
                    <Switch
                        label="I accept the privacy policy."
                        checked={acceptedRequirements.privacy_policy}
                        onChange={(checked) => {
                            if (checked != acceptedRequirements.privacy_policy) {
                                setAcceptedRequirements({
                                    ...acceptedRequirements,
                                    privacy_policy: checked,
                                });
                            }
                        }}
                        mandatory={true}
                        description="I have read and agree to the service's privacy policy."
                    />
                    <button className="primary-button" onClick={() => {
                        window.open(service?.public?.privacy_policy_url || "https://www.naflows.com/legal/privacy-policy", "_blank");
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240q17 0 28.5 11.5T480-800q0 17-11.5 28.5T440-760H200v560h560v-240q0-17 11.5-28.5T800-480q17 0 28.5 11.5T840-440v240q0 33-23.5 56.5T760-120H200Zm560-584L416-360q-11 11-28 11t-28-11q-11-11-11-28t11-28l344-344H600q-17 0-28.5-11.5T560-800q0-17 11.5-28.5T600-840h200q17 0 28.5 11.5T840-800v200q0 17-11.5 28.5T800-560q-17 0-28.5-11.5T760-600v-104Z" /></svg>
                    </button>
                </div>
                <div className="switch__content">
                    <Switch
                        label="Allow data sharing with this service."
                        checked={acceptedRequirements.data_share}
                        onChange={(checked) => {
                            if (checked != acceptedRequirements.data_share) {
                                setAcceptedRequirements({
                                    ...acceptedRequirements,
                                    data_share: checked,
                                });
                            }
                        }}
                        mandatory={true}
                        description="I accept that my personal data will be shared with the service as described above."
                    />
                </div>
            </div>
            <p className="subtitle-informations">
                By joining this service, you agree to comply with its terms and conditions. Failure to adhere to these terms may result in suspension or termination of your access to the service.
                If you have any questions or concerns regarding these terms, please contact the service provider directly for clarification before proceeding.
            </p>
        </div>
    )
}


export default TermsAndRequirements;