import type { ServicesBodyProps } from "../../../../types/ServicesBodyProps";

import "../../../../../public/root/pages/services/manage/sub-components/CompactServiceDescription.scss";

const CompactServiceDescription = ({
    service,
    owned = false
}: {
    service: ServicesBodyProps | null,
    owned?: boolean,
}) => {
    if (service) {
        return (
            <div className="service__compact__description" onClick={() => {
                if (owned) {
                    window.location.href = `/services/manage/${service.id}`;
                } else {
                    window.location.href = `/account/services/${service.id}`;
                }
            }}>
                <div className="service__compact__description__header">
                    <div className="service__compact__description__header__icon">
                        <img src={service.banner || "/default-service-banner.png"} alt="Service Banner" className="service__banner" />
                        <div className={`connection__status ${service.user_active ? "connected" : "disconnected"}`}>
                            <span>
                                {service.user_active ? "Connected" : "Disconnected"}
                            </span>
                        </div>
                        <div className="service__compact__description__pseudo__image">
                            {service.picture ? (
                                <img src={service.picture} alt={service.name} />
                            ) : (
                                <div className="service__compact__description__placeholder">
                                    <span>No Image Available</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="service__compact__description__body">
                    <div className="service__description__head">
                        <div className="service__description__name">
                            <h2>
                                <span className="service__name">{service.name}</span>
                            </h2>
                            <div className="service__description__details">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Zm0-82q26-36 45-75t31-83H404q12 44 31 83t45 75Zm-104-16q-18-33-31.5-68.5T322-320H204q29 50 72.5 87t99.5 55Zm208 0q56-18 99.5-55t72.5-87H638q-9 38-22.5 73.5T584-178ZM170-400h136q-3-20-4.5-39.5T300-480q0-21 1.5-40.5T306-560H170q-5 20-7.5 39.5T160-480q0 21 2.5 40.5T170-400Zm216 0h188q3-20 4.5-39.5T580-480q0-21-1.5-40.5T574-560H386q-3 20-4.5 39.5T380-480q0 21 1.5 40.5T386-400Zm268 0h136q5-20 7.5-39.5T800-480q0-21-2.5-40.5T790-560H654q3 20 4.5 39.5T660-480q0 21-1.5 40.5T654-400Zm-16-240h118q-29-50-72.5-87T584-782q18 33 31.5 68.5T638-640Zm-234 0h152q-12-44-31-83t-45-75q-26 36-45 75t-31 83Zm-200 0h118q9-38 22.5-73.5T376-782q-56 18-99.5 55T204-640Z" /></svg>
                                    <a
                                        href={`https://${service.dns}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="tertiary-button"
                                    >
                                        {service.dns}
                                    </a>
                                </span>
                                <span style={{ display: service.details.official ? "inline-flex" : "none" }} className="official-badge" title="This service is owned and operated by Naflows, which means it has been developed in-house and is maintained directly by the Naflows team.">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m438-452-56-56q-12-12-28-12t-28 12q-12 12-12 28.5t12 28.5l84 85q12 12 28 12t28-12l170-170q12-12 12-28.5T636-593q-12-12-28.5-12T579-593L438-452Zm42 368q-7 0-13-1t-12-3q-135-45-215-166.5T160-516v-189q0-25 14.5-45t37.5-29l240-90q14-5 28-5t28 5l240 90q23 9 37.5 29t14.5 45v189q0 140-80 261.5T505-88q-6 2-12 3t-13 1Z" /></svg>
                                    Naflows-Owned Service
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default CompactServiceDescription;