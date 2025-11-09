import { useEffect, useRef, useState } from "react";
import CopyButton from "../../../../../../../../global/components/CopyButton";
import type { ServicesForUserProps, ServiceUser } from "../../../../../../../../types/ServicesForUserProps";
import { createdAtToAgo } from "../../../../../../../account/sub-components/notifications/methods/createdAtToAgo";
import AddUserRight from "./add-rights";
import ServiceRights from "./small-right";




const RightComponent = ({ rights, type, service, userInfo }: { rights: ServiceUser["rights"], type: "SERVICE_BY_NASS" | "SERVICE_BY_INSTANCE", service: ServicesForUserProps | null, userInfo: ServiceUser }) => {
    const buttonRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const [top, setTop] = useState<string>("0px");
    const [left, setLeft] = useState<string>("0px");
    const [clicked, setClicked] = useState<boolean>(false);

    const handleButtonClick = () => {
        const buttonElement = buttonRef.current;
        if (!buttonElement) {
            console.warn("Button element is not available.");
            return;
        }
        const element = document.getElementById(`add-right-button-${type}-${userInfo.id}`);

        if (element) {
            const rect = element.getBoundingClientRect();
            setTop(`${rect.bottom + 2}px`);
            setLeft(`${rect.left}px`);
        }
        setClicked(prev => !prev);
    };

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                clicked &&
                buttonRef.current &&
                popupRef.current &&
                !buttonRef.current.contains(event.target as Node) &&
                !popupRef.current.contains(event.target as Node)
            ) {
                setClicked(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [clicked]);

    return (
        <div className={`nass__rights__container ${rights.length === 0 ? "empty" : ""}`}>
            {clicked && (
                <div
                    ref={popupRef}
                    style={{
                        position: "absolute",
                        top: top,
                        left: left,
                    }}
                >
                    <AddUserRight service={service} type={type} currentRights={rights} userID={userInfo.id} />
                </div>
            )}


            <span className="rights__container__title">
                {type === "SERVICE_BY_NASS" ? "NASS Rights" : "Instance Rights"}
            </span>
            <div className="list">
                {rights.map((right) => {
                    if (right.type === type) {
                        return (
                            <ServiceRights key={right.id} id={right.id} name={right.name} hue={right.hue} />
                        );
                    }
                    return null; // Add explicit return for false condition
                })}
                <div
                    ref={buttonRef}
                    className="user__item__right add-button"
                    title="Add Right"
                    onClick={handleButtonClick}
                    id={`add-right-button-${type}-${userInfo.id}`}
                >
                    <span style={{ display: "none" }}>Add</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

const ListedUser = ({ user, service }: { user: ServiceUser, service: ServicesForUserProps | null }) => {



    return (
        <div key={user.id} className="user__item">
            <div className="user__item__info">
                <div className="profile__picture">
                    <img src={user.profile_picture} alt={user.username} className="user__item__avatar" />
                    {service?.created_by === user.id && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
                <div className="item__info__header">
                    <span className="user__item__username">{user.username}</span>
                    <span className="user__item__email">{user.email}</span>
                    <span className="user__item__uid">
                        <span className="user__item__id">{user.id}</span>
                        <CopyButton textToCopy={user.id} className="user__item__copy-button" />
                    </span>
                </div>
            </div>
            <div className="user__item__rights">


                <>
                    {(
                        <RightComponent rights={user.rights} type="SERVICE_BY_NASS" service={service} userInfo={user} />
                    )}
                    {(
                        <RightComponent rights={user.rights} type="SERVICE_BY_INSTANCE" service={service} userInfo={user} />
                    )}
                </>

            </div>

            <div className="user__additional__content">
                <div className="user__item__dates">
                    <span className="user__item__joined">Joined: {createdAtToAgo(user.joined_on)}</span>
                    <span className="user__item__last-updated">Last Updated: {createdAtToAgo(user.last_updated)}</span>
                </div>

                <div className="user__actions">
                    <button className={`user__action__manage secondary-button ${!user.you_can_manage || user.you ? "inactive" : ""}`}>Manage</button>
                    <button className={`user__action__remove tertiary-button danger-button ${!user.you_can_manage || user.you ? "inactive" : ""}`}>Expulse</button>
                </div>
            </div>
        </div>
    )
}

export default ListedUser;

