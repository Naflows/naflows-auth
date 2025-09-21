import { useEffect } from "react";
import GlobalDisclaimer from "../../../../global/components/GlobalDisclaimer";


const ServiceCreationDisclaimer = ({
    setGuidelinesAccepted,
    guidelinesAccepted
}: {
    setGuidelinesAccepted: (accepted: boolean) => void;
    guidelinesAccepted?: boolean;
}) => {

    const handleCheckboxChange = () => {
        const checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
        const allChecked = Array.from(checkboxes).every(checkbox => (checkbox as HTMLInputElement).checked);
        setGuidelinesAccepted(allChecked);
    }

    useEffect(() => {
        if (guidelinesAccepted) {
            const checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                (checkbox as HTMLInputElement).checked = true;
            });
        }
    }, [guidelinesAccepted])


    return (
        <GlobalDisclaimer
            title="Important Notice"
            message="Naflows Services are subject to strict compliance with our policies and guidelines. Please read the following information carefully before creating a service."
            content={<>
                <div className="checkbox-container">
                    <input type="checkbox" id="tos" onChange={handleCheckboxChange} />
                    <label htmlFor="tos">
                        I agree to the <a href="/legal/acceptable-use-policy" target="_blank" rel="noopener noreferrer">Acceptable Use Policy</a> and confirm that my service will comply with it.
                    </label>
                </div>
                <div className="checkbox-container">
                    <input type="checkbox" id="consent" onChange={handleCheckboxChange} />
                    <label htmlFor="consent">
                        I agree to the <a href="/legal/terms-of-service" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
                    </label>
                </div>
            </>
            }
        />
    )

}

export default ServiceCreationDisclaimer;