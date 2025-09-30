import { useEffect, useState } from "react";
import type { AlertContentProps } from "../../../global/error-alert/Alert";
import Alert from "../../../global/error-alert/Alert";
import ServiceDescription from "../manage/sub-component/ServiceDescription";
import '../../../../public/root/pages/services/join/index.scss';
import { dataPreferences } from "../../account/sub-components/core/connections/PersonalInformations";
import AccountHeader from "../../account/account-header/AccountHeader";
import TermsAndRequirements from "./components/legal";
import { FetchUserData } from "../../../root/scripts/fetch/user";
import { FetchServiceUserData } from "../../../root/scripts/fetch/services/user-data";
import UserIsAlreadyRegistered from "./components/user-registered";
import GlobalLoader from "../../../root/components/global-loader";
import UserNotConnected from "./components/user-not-connected";
import { SendCodeForSubmission } from "../../../root/scripts/put/send-code";



const JoinPage = () => {
    const [serviceID, setServiceID] = useState<string | null>(null);
    const [displayAlert, setDisplayAlert] = useState<AlertContentProps>({
        status: 0,
        message: "",
        success: false,
        closeAlert: true,
    });

    const [displayAlertCode, setDisplayAlertCode] = useState<AlertContentProps>({
        status: 0,
        message: "",
        success: false,
        closeAlert: true,
    });

    const [acceptedRequirements, setAcceptedRequirements] = useState<{
        data_share: boolean;
        terms_of_service: boolean;
        privacy_policy: boolean;
    }>({
        data_share: false,
        terms_of_service: false,
        privacy_policy: false,
    });
    const [requirementsAccepted, setRequirementsAccepted] = useState<boolean>(false);
    useEffect(() => {
        setRequirementsAccepted(acceptedRequirements.data_share && acceptedRequirements.terms_of_service && acceptedRequirements.privacy_policy);
    }, [acceptedRequirements])



    useEffect(() => {
        const pathParts = window.location.pathname.split("/");
        const id = pathParts[3];
        if (id) {
            setServiceID(id);
        }
    }, [])

    const userInfo = FetchUserData(setDisplayAlert);
    const service = FetchServiceUserData(serviceID, userInfo ? userInfo.id : null, setDisplayAlert);

    if (!service) {
        return <GlobalLoader loading={true} content={<span> Loading service information... </span>} />
    }

    if (displayAlert.status != 0) {
        return (
            <div className="nass__page__loader">
                <Alert
                    alert={displayAlert}
                    setAlert={setDisplayAlert}
                />
            </div>
        )
    }


    if (service?.details.user_is_registered) {
        return (
            <UserIsAlreadyRegistered service={service} userInfo={userInfo ? userInfo : null} />
        )
    }



    return (
        <>
            <div className="nass__page">
                <AccountHeader selectedTab="services" userFetch={userInfo ? userInfo : undefined} />
                <div className="nass__join__page ">
                    <div className={`nass__connect__service ${userInfo ? "user-connected" : "user-not-connected"}`}>
                        <div className="user__headband">
                            {
                                userInfo && (
                                    <div className="user__info">
                                        <div className="user__info__header">
                                            <h3>Welcome, {userInfo.first_name}!</h3>
                                            <p>
                                                You are about to connect your Naflows account to the service <strong>{service ? service.name : "Loading..."}</strong>.
                                            </p>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <div className="nass__service__connection__body">
                            <div className="service__informations">
                                <ServiceDescription service={service} publicDisplay={true} />
                                <Alert
                                    alert={displayAlertCode}
                                    setAlert={setDisplayAlertCode}
                                />
                                <button className={`primary-button connect-button ${!requirementsAccepted ? "inactive" : ""}`} disabled={!requirementsAccepted} onClick={() => {
                                    if (requirementsAccepted) {
                                        SendCodeForSubmission(
                                            userInfo ? userInfo.email : "",
                                            setDisplayAlertCode,
                                            displayAlertCode,
                                            {
                                                valueOnSuccess: `You have been successfully connected to ${service.name}. You will be redirected shortly.`,
                                                inputLabel: "service-connection-code",
                                                data: {
                                                    serviceID: service.id,
                                                },
                                                route: "/user/secure/service/register",
                                                redirectOnSuccess: `/account/services/${service.id}`
                                            }
                                        );
                                    }
                                }}>
                                    <span>Connect to {service ? service.name : "the service"}</span>
                                </button>
                            </div>



                            <div className="service__connection__information">
                                <UserNotConnected userInfo={userInfo ? userInfo : null} />

                                <div className="service__connection__details">
                                    <img src={userInfo?.profile_picture || ""} alt="User profile" className="user__profile__picture small" style={{
                                        display: userInfo && userInfo.profile_picture ? "block" : "none",
                                    }} />


                                    {service?.public_settings?.required_data && service.public_settings.required_data.length > 0 && (<div className="service__connection__detail__body">
                                        <div className="service__actions__field__header">
                                            <h3 className="service__actions__field__title">
                                                <span>
                                                    Naflows will share this data with {
                                                        service ? service.name : "the service"
                                                    }
                                                </span>
                                            </h3>
                                            <p>You can always update these preferences late.</p>
                                        </div>
                                        <div className="service__connection__details__content">
                                            {Object.entries(dataPreferences).map(([key, info]) => {
                                                if (service.public_settings && service.public_settings.required_data && service.public_settings.required_data.includes(key as keyof typeof dataPreferences)) {
                                                    return (
                                                        <div className="data__item" key={key}>
                                                            <div className="data__item__header">
                                                                {info.svg}
                                                            </div>
                                                            <div className="data__item__content">
                                                                <h4>{info.title}</h4>
                                                                <p>{info.description}</p>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>
                                    </div>)}
                                    <TermsAndRequirements
                                        service={service}
                                        acceptedRequirements={acceptedRequirements}
                                        setAcceptedRequirements={setAcceptedRequirements}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
};


export default JoinPage;