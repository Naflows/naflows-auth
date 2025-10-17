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
                        {success.success ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h287q16 0 30.5 6t25.5 17l194 194q11 11 17 25.5t6 30.5v447q0 33-23.5 56.5T720-80H240Zm280-560q0 17 11.5 28.5T560-600h160L520-800v160Zm-83 285-56-56q-6-6-13-9t-14.5-3q-7.5 0-15 3t-13.5 9q-12 12-12 28.5t12 28.5l85 86q6 6 13 8.5t15 2.5q8 0 15-2.5t13-8.5l169-169q12-12 12-29t-12-29q-12-12-29-12t-29 12L437-355Z"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm0-160q17 0 28.5-11.5T520-480v-160q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640v160q0 17 11.5 28.5T480-440ZM363-120q-16 0-30.5-6T307-143L143-307q-11-11-17-25.5t-6-30.5v-234q0-16 6-30.5t17-25.5l164-164q11-11 25.5-17t30.5-6h234q16 0 30.5 6t25.5 17l164 164q11 11 17 25.5t6 30.5v234q0 16-6 30.5T817-307L653-143q-11 11-25.5 17t-30.5 6H363Z"/></svg>}
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
                <div className="form__container">
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

