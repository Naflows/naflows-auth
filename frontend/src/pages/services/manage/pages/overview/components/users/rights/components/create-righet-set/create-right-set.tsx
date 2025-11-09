import { useEffect, useState } from "react";
import type { ServicesForUserProps } from "../../../../../../../../../../types/ServicesForUserProps";
import type { ServiceRights } from "../../../../../../../../../../types/TunnelingTypes";
import CreateRightDetails from "./steps/right-details";
import CreateRightsDefinition from "./steps/rights-definition";
import Loader from "../../../../../../../../../../global/components/Loader";
import useCreateRight from "./methods/create-right";


const CreateRightSet = ({
    service,
    createRightSet, setCreateRightSet,
    setLoadServices
}: {
    service: ServicesForUserProps,
    createRightSet: boolean,
    setCreateRightSet: React.Dispatch<React.SetStateAction<boolean>>,
    setLoadServices: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const [rightSetValue, setRightSetValue] = useState<ServiceRights | null>({
        id: "",
        name: "",
        hue: Math.floor(Math.random() * 360).toString(),
        rights: [],
        type: "SERVICE_BY_NASS",
        created_at: 0,
        updated_at: 0,
        service_id: service.id,
        deletable: true,
        usersPerRights: []
    });
    const [buttonEnabled, setButtonEnabled] = useState<boolean>(false);
    const [section, setSection] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<{
        success: boolean,
        message: string,
        status: number
    }>({
        success: false,
        message: "",
        status: 0
    });

    useEffect(() => {
        if (rightSetValue) {
            if (
                (section === 1 && rightSetValue.name.trim().length > 0) ||
                (section === 2 && rightSetValue.rights.length > 0)
            ) {
                setButtonEnabled(true);
            } else {
                setButtonEnabled(false);
            }
        }
    }, [rightSetValue, section])

    useEffect(() => {
        // Set even "enter" key to move to next section if button enabled
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                e.preventDefault();
                console.log("Enter key pressed");
                if (buttonEnabled) {
                    if (section < 2) {
                        setSection(section + 1);
                    }
                }
            }
            if (e.key === "Escape") {
                e.preventDefault();
                if (section === 1) {
                    setCreateRightSet(false);
                    setRightSetValue(null);
                    setSection(1);
                } else {
                    setSection(section - 1);
                }
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        }
    }, [section, setCreateRightSet, setRightSetValue, buttonEnabled])

    useEffect(() => {
        if (!createRightSet) {
            document.body.style.overflow = "auto";
        } else {
            document.body.style.overflow = "hidden";
            setRightSetValue({
                id: "",
                name: "",
                hue: Math.floor(Math.random() * 360).toString(),
                rights: [],
                type: "SERVICE_BY_NASS",
                created_at: 0,
                updated_at: 0,
                service_id: service.id,
                deletable: true,
                usersPerRights: []
            });
            setSection(1);
        }
    }, [createRightSet])


    useCreateRight(
        rightSetValue,
        section,
        setLoading,
        setSuccess

    );



    if (!rightSetValue) return <></>;

    if (success.status != 0) {
        return (
            <div className="form__overlay">
                <div className="form__container">
                    <div className={`form__header ${success.success ? "success" : "error"}`} id="rights-process-done">
                        {success.success ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                        </svg>
                            : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                            </svg>
                        }
                        <div className="header__body">
                            <h3>{success.success ? "Right Created" : "Something went wrong"}</h3>
                            <p>{success.message}</p>
                        </div>
                    </div>
                    <div className="buttons-container">
                        <button onClick={() => {
                            setCreateRightSet(false);
                            setRightSetValue(null);
                            setSection(1);
                            setSuccess({
                                success: false,
                                message: "",
                                status: 0
                            });
                            setLoadServices(true);
                        }} className="primary-button width-100-auto">Close</button>
                    </div>
                </div>
            </div>
        )
    }

    if (service && createRightSet) {

        return (
            <div className="form__overlay">
                <div className="form__container" style={{
                    minWidth: section === 2 ? "80%" : "500px"
                }}>
                    <div className="form__header">
                        <h3>Create New Right Set for {service.name}</h3>
                        <p>Please fill in the details below to create a new right set. Looking for a guide to help you? <a href="https://docs.naflows.com/rights">read the documentation</a>.</p>
                    </div>
                    <div className="form__content">
                        {section === 1 && <CreateRightDetails rightSetValue={rightSetValue} setRightSetValue={setRightSetValue} />}
                        {section === 2 && <CreateRightsDefinition rightSetValue={rightSetValue} setRightSetValue={setRightSetValue} />}
                        {section === 3 && (
                            loading ? (
                                <Loader loading={true} />
                            ) : (
                                <div className="result__information">
                                    <div className="result__information__title">
                                        {success.success ? ("Success") : ("Error")}
                                    </div>
                                    <div className={`result__information__message ${success.success ? "success" : "error"}`}>
                                        {success.message}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                    <div className="buttons-container">
                        <button onClick={() => {
                            setCreateRightSet(false);
                            setRightSetValue(null);
                            setSection(1);
                        }} className="secondary-button" title="Close Create Right Set Form">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h160q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720v520q0 33-23.5 56.5T680-120H280Zm200-284 76 76q11 11 28 11t28-11q11-11 11-28t-11-28l-76-76 76-76q11-11 11-28t-11-28q-11-11-28-11t-28 11l-76 76-76-76q-11-11-28-11t-28 11q-11 11-11 28t11 28l76 76-76 76q-11 11-11 28t11 28q11 11 28 11t28-11l76-76Z" /></svg>
                        </button>
                        <button className="secondary-button width-100-auto" onClick={() => {
                            if (section > 1) {
                                setSection(section - 1);
                            }
                        }} title="Back to Previous Step" style={{
                            display: section === 1 ? "none" : "flex"
                        }}>
                            Back
                        </button>
                        <button onClick={() => {
                            if (buttonEnabled) {
                                if (section < 3) {
                                    setSection(section + 1);
                                }
                            }
                        }} className={`primary-button ${buttonEnabled ? "" : "inactive"} width-100-auto`} title="Create Right Set">
                            {section < 2 ? "Next" : "Create Right Set"}
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateRightSet;

