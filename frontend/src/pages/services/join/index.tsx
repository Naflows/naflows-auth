import { useEffect, useState } from "react";
import { type UserBodyProps } from "../../../types/UserBodyProps";
import Alert from "../../../global/error-alert/Alert";
import ServiceDescription from "../manage/sub-component/ServiceDescription";
import '../../../../public/root/pages/services/join/index.scss';
import type { ServicesBodyProps } from "../../../types/ServicesBodyProps";
import { dataPreferences } from "../../account/sub-components/core/connections/PersonalInformations";
import AccountHeader from "../../account/account-header/AccountHeader";
import Loader from "../../../global/components/Loader";
import TermsAndRequirements from "./sub-components/TermsAndRequirements";
import ManageAlert from "./sub-components/ManageAlert";
import AppFooter from "../../../global/components/AppFooter";
import type { AlertContentProps } from "../../../types/AlertContentProps.type";
import { OnError } from "./sub-components/OnError";
import { UserAlreadyRegistered } from "./sub-components/UserAlreadyRegistered";
import { useFetchUserInfo } from "../../../scripts/account/use/fetch-user-info";
import { getPublicServiceInformations } from "../../../scripts/pages/services/get/get-public-infos";



const JoinPage = () => {
    const [userInfo, setUserInfo] = useState<UserBodyProps | undefined>(undefined);
    const [serviceID, setServiceID] = useState<string | null>(null);
    const [service, setService] = useState<ServicesBodyProps | null>(null);
    const [successfullUserFetch, setSuccessfulUserFetch] = useState<boolean>(false);
    // Note: it looks like I put true where I should have put false... my bad :)
    const [userIdQueried, setUserIdQueried] = useState<boolean>(true);
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

    // Get account info ; redirect to login if not logged in
    useFetchUserInfo({ setUserInfo  });

    useEffect(() => {
        if (userInfo) {
            console.log("User info updated:", userInfo);
            setUserIdQueried(false);
            setSuccessfulUserFetch(true);
        } else {
            // Just in case useFetchUserInfo fails to redirect (should not happen tho, but just in case)
            setDisplayAlert({
                status: 401,
                message: "You need to be logged in to join a service. Please log in to your Naflows account.",
                success: false,
                closeAlert: false,
                title: "Not Logged In",
                displayCode: true,
                customClose: {
                    text: "Go to Login",
                    action: () => {
                        window.location.href = `/login?redirect=/services/join/${serviceID}`;
                    }
                }   
            })
        }
    }, [userInfo])


    useEffect(() => {
        if (!userIdQueried && serviceID != null) {

            async function fetchServiceData() {
                // If the service is already set or serviceID is null, do nothing
                if (service || serviceID === null) return;

                const serviceData = await getPublicServiceInformations(serviceID, userInfo?.id || null);
                if (serviceData) {
                    setService(serviceData);
                    setUserIdQueried(true);
                } else {
                    setDisplayAlert({
                        status: 404,
                        message: "The service you are trying to join does not exist. Please check the link or contact support.",
                        success: false,
                        closeAlert: false,
                        title: "Error Fetching Service Data",
                        displayCode: true,
                    });
                }
            }

            fetchServiceData();
        }
    }, [serviceID, service, userIdQueried])


    // If something went wrong, redirect on input
    if (!successfullUserFetch) return <OnError displayAlert={displayAlert} setDisplayAlert={setDisplayAlert} />;

    if (!service) {
        return (
            <div
                className="nass__page__loader"
            >
                <h3>Loading service information...</h3>
                <Loader loading={true} />
            </div>
        )
    }


    if (service?.details.user_is_registered) return <UserAlreadyRegistered service={service} userInfo={userInfo} />;
    



    // UserInfo is loaded, service is loaded, render the join page for any user who is not registered yet
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
                                    ManageAlert({
                                        requirementsAccepted,
                                        userInfo : { email : userInfo?.email || "" },
                                        displayAlertCode,
                                        setDisplayAlertCode,
                                        service
                                    });
                                }}>
                                    <span>Connect to {service ? service.name : "the service"}</span>
                                </button>
                            </div>



                            <div className="service__connection__information">
                                <div className="service__connection__details">
                                    <div className="connection__details__user">
                                        <div className="details__global">
                                            <img src={userInfo?.profile_picture || ""} alt="User profile" className="user__profile__picture small" style={{
                                                display: userInfo && userInfo.profile_picture ? "block" : "none",
                                            }} />
                                            <div className="profile__container">
                                                <h3 className="user__name">
                                                    {userInfo ? `${userInfo.first_name} ${userInfo.last_name}` : "Guest User"}
                                                </h3>
                                                <p className="user__email">
                                                    {userInfo ? userInfo.email : "You are not logged in."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>


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
                                                if (service.public_settings && service.public_settings.required_data && service.public_settings.required_data.includes((key as keyof typeof dataPreferences))) {
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
            </div>
            <AppFooter />

        </>
    )
};


export default JoinPage;