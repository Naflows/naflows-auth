

export const WelcomeOverlayStepButton = ({ stepNumber, description, subdescription }: { stepNumber: number, description: string,  subdescription: string }) => {
    return (
        <div className="welcome-overlay__step-button" style={{
            animationDelay: `${(stepNumber) * 0.2}s`
        }}> 
            <div className="step">
                <div className="step__body">
                    <span className="step__number">{stepNumber}</span>
                    <span className="step__description">{description}</span>
                    <div className="step__subdescription">
                        {subdescription}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default WelcomeOverlayStepButton;