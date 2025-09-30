import Input from "../../../../../../global/components/Input"



const CodeSubmissionInput = ({
    truncatedEmail,
    inputLabel = "service-connection-code"
} : {
    truncatedEmail: string;
    inputLabel?: string;
}) => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
        }}>
            <span className="subtitle">A connection code was sent to your email <strong>{truncatedEmail}</strong> in order to verify your identity. Please enter it below to continue.</span>
            <Input
                label="Enter the code"
                type="number"
                maxChar={6}
                maxLength={6}
                displayMaxChar={true}
                name={inputLabel}
                required={true}
                onChange={() => { }}
            />
        </div>
    )
}

export default CodeSubmissionInput