import GlobalDisclaimer from "../../../../../global/components/GlobalDisclaimer";
import Input from "../../../../../global/components/Input";
import type { ServicesForUserProps } from "../../../../../types/ServicesForUserProps";
import AccountHeader from "../../../../account/components/account-header/AccountHeader";
import ServiceDescription from "../../../manage/sub-component/ServiceDescription";
import AccountDir from "../../../components/service-directory";
import type { UserBodyProps } from "../../../../../types/UserBodyProps";
import type { ServicesBodyProps } from "../../../../../types/ServicesBodyProps";



const UserIsAlreadyRegistered = ({
    service,
    userInfo
} : {
    service: ServicesBodyProps,
    userInfo: UserBodyProps | null
}) => {
    return (
        <>
            <AccountHeader selectedTab="services" userFetch={userInfo ? userInfo : undefined} />
            <div className="nass__join__page nass__page">
                <AccountDir service={service as ServicesForUserProps} tab="share" title="Share Service" description="Share this service with others." />

                <div className={`nass__connect__service ${userInfo && "user-connected-already-registered"}`}>
                    <ServiceDescription service={service} publicDisplay={true} />
                    <div className="registration__done__content">
                        <div className="disclaimer__content">
                            <div className="disclaimer__content__header">
                                <img src={userInfo?.profile_picture || ""} alt="User profile" className="user__profile__picture small" style={{
                                    display: userInfo && userInfo.profile_picture ? "block" : "none",
                                }} />
                                <button className="secondary-button" onClick={() => {
                                    window.location.href = `/login?redirect=/services/join/${service.id}`;
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
                                name="service_link"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserIsAlreadyRegistered;