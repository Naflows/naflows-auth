import { useEffect, useState } from "react";
import { type UserBodyProps } from "../../../types/UserBodyProps";
import fetchData from "../../../scripts/account/get-user-info";
import type { AlertContentProps } from "../../../global/error-alert/Alert";
import Alert from "../../../global/error-alert/Alert";
import axios from "axios";
import ServiceDescription from "../manage/sub-component/ServiceDescription";
import '../../../../public/root/pages/services/join/index.scss';
import type { ServicesBodyProps } from "../../../types/ServicesBodyProps";
import { dataPreferences } from "../../account/sub-components/core/connections/PersonalInformations";
import GlobalDisclaimer from "../../../global/components/GlobalDisclaimer";
import AccountHeader from "../../account/account-header/AccountHeader";
import Loader from "../../../global/components/Loader";
import TermsAndRequirements from "./sub-component/TermsAndRequirements";
import ManageAlert from "./sub-component/ManageAlert";
import Input from "../../../global/components/Input";
import AccountDir from "../manage/sub-component/ServiceDir";
import type { ServicesForUserProps } from "../../../types/ServicesForUserProps";



const JoinPage = () => {
    const [userInfo, setUserInfo] = useState<UserBodyProps | null>(null);
    const [serviceID, setServiceID] = useState<string | null>(null);
    const [service, setService] = useState<ServicesBodyProps | null>(null);
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

    useEffect(() => {
        (async () => {
            try {
                const res = await fetchData("user");
                if (res.data && res.data.data && res.data.data.user) {
                    setUserInfo(res.data.data.user as UserBodyProps);
                    setUserIdQueried(false);
                }
            } catch (error) {
                const status = (error as any)?.response?.status || 500;
                if (status != 400 && status != 401 && status != 403) {
                    setDisplayAlert({
                        status: (error as any)?.response?.status || 500,
                        message: "Failed to get user data. You might need to login again.",
                        success: false,
                        closeAlert: false,
                        customClose: {
                            text: "Go to Login",
                            action: () => { window.location.href = `/login?redirect=/services/join/${serviceID}`; }
                        },
                        title: "Error Fetching User Data",
                    });
                }
            }
        })();

    }, [serviceID])


    useEffect(() => {
        if ((service == null || !userIdQueried) && serviceID) {
            (async () => {
                try {
                    const res = await axios.get(`${process.env.DUMMY_API_URL_DEV}/public/services/${serviceID}/infos/${userInfo?.id || "null"}`);
                    if (res.data) {
                        console.log("Fetched service data:", res.data);
                        setService(res.data);
                        setUserIdQueried(true);
                    } else {
                        throw new Error("Failed to fetch service data");
                    }
                } catch (error) {
                    setDisplayAlert({
                        status: (error as any)?.response?.status || 500,
                        message: "Failed to fetch service data. Please try again. Make sure the service exists.",
                        success: false,
                        closeAlert: false,
                        title: "Error Fetching Service Data",
                        displayCode: true,
                    });
                }
            })();
        }
    }, [serviceID, service, userIdQueried])

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
            <>
                <AccountHeader selectedTab="services" userFetch={userInfo ? userInfo : undefined} />
                <div className="nass__join__page nass__page">
                    <AccountDir service={service as ServicesForUserProps} tab="share" title="Share Service" description="Share this service with others." setTab={() => {}} />

                    <div className={`nass__connect__service ${userInfo && "user-connected-already-registered"}`}>
                        <ServiceDescription service={service} publicDisplay={true} />
                        <div className="registration__done__content">
                            <div className="disclaimer__content">
                                <div className="disclaimer__content__header">
                                    <img src={userInfo?.profile_picture || ""} alt="User profile" className="user__profile__picture small" style={{
                                        display: userInfo && userInfo.profile_picture ? "block" : "none",
                                    }} />
                                    <button className="secondary-button" onClick={() => {
                                        window.location.href = `/login?redirect=/services/join/${serviceID}`;
                                    }}>
                                        <span>My Account</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" /></svg>
                                    </button>
                                </div>
                                <GlobalDisclaimer
                                    title={`You are already registered in ${service.name}`}
                                    message={`You already have an account in ${service.name}. You can log in directly on their platform using your existing credentials.`}
                                />
                                <button className="primary-button" onClick={() => {
                                    // TODO
                                }}>
                                    <span>Manage {service.name}</span>
                                </button>
                            </div>
                            <div className="user__body__section">
                                <div className="service__actions__field__header">
                                    <h3 className="service__actions__field__title">{service.public_settings?.allow_public_visibility ? "This service is publicly visible." : "This service is not publicly visible."}</h3>
                                    <p>
                                        {service.public_settings?.allow_public_visibility ? "This service is listed in the Naflows services directory, meaning any user can find and connect to it. You can share this service with others." : "This service is not listed in the Naflows services directory, meaning only users with a direct link can find and connect to it."}
                                    </p>
                                </div>
                                <Input
                                    label="Service Link"
                                    type="text"
                                    value={`https://www.naflows.com/services/join/${service.id}`}
                                    editMode={false}
                                    required={false}
                                    allowCopy={true}
                                    fitContent={false}
                                    name="service_link"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </>
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
                                    ManageAlert({
                                        requirementsAccepted,
                                        userInfo,
                                        displayAlertCode,
                                        setDisplayAlertCode,
                                        service
                                    });
                                }}>
                                    <span>Connect to {service ? service.name : "the service"}</span>
                                </button>
                            </div>



                            <div className="service__connection__information">
                                {!userInfo && (
                                    <div className="service__connection__info alert">
                                        <div className="user__info">
                                            <div className="service__actions__field__header">
                                                <h3 className="service__actions__field__title">You are not connected</h3>
                                                <p>
                                                    Please log in to your Naflows account to connect to this service.
                                                    <br />
                                                    Connecting to your Naflows account will not automatically register you in the service if you don't have an account there yet.
                                                </p>
                                            </div>
                                            <button className="primary-button" onClick={() => {
                                                window.location.href = `/login?redirect=/services/join/${serviceID}`;
                                            }}>
                                                <span>Log in to Naflows</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                )}

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
                                                if (service.public_settings && service.public_settings.required_data && service.public_settings.required_data.includes((    key as keyof typeof dataPreferences))) {
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
        </>
    )
};


export default JoinPage;