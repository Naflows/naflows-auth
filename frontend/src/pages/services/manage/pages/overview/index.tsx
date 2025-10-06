import type { ServicesForUserProps } from "../../../../../types/ServicesForUserProps"
import ServiceCapacities from "../../sub-component/capacities"
import ServiceDescription from "../../sub-component/ServiceDescription"
import { useEffect, useState } from "react"
import { SERVICE_OVERVIEW_TABS, type ServiceOverviewTabs } from "./types/tabs.type"
import ServiceSettings from "./components/settings"
import QuickActions from "./components/quick-actions"
import LatestLogs from "./components/latest-logs"
import Input from "../../../../../global/components/Input"


const ManageServiceOverview = ({
    service,
    setService
}: {
    service: null | ServicesForUserProps;
    setService: (service: ServicesForUserProps) => void
}) => {

    const [serviceTabs, setServiceTabs] = useState<ServiceOverviewTabs>("settings");

    useEffect(() => {
        // Set URL params
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("tab", serviceTabs);
        window.history.replaceState({}, "", `${window.location.pathname}?${urlParams}`);
    }, [serviceTabs])

    return (
        <div className="manage__service__body">
            <div
                className="parent__of__section row__layout service__manage__content"
                style={{
                    width: "100%"
                }}
            >

                <div className="parent__of__section row__layout" id="left-side">
                    <ServiceDescription service={service} />

                </div>

                <div className="parent__of__section row__layout" id="right-side">
                    <div className="right__side__header">
                        <LatestLogs service={service} />
                        <QuickActions service={service} setService={setService} />
                        <ServiceCapacities service={service} />
                    </div>
                    <div className="user__body__section">
                        <div className="service__overview__tabs">
                            {SERVICE_OVERVIEW_TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    className={`tab ${serviceTabs === tab.id ? "primary-button" : "secondary-button"}`}
                                    onClick={() => setServiceTabs(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        <div className="service__overview__tab__content">
                            {serviceTabs === "settings" && <ServiceSettings service={service} />}
                            {serviceTabs === "safety" &&
                                <>
                                    <div className="service__overview__tab__content">
                                        <div className="service__overview__tab__header">
                                            <h2>Security Measures</h2>
                                            <p>Manage the security measures for your service to ensure the safety of your users and data.</p>
                                        </div>
                                        <div className="global__container" id="security-data">
                                            <div className="key__container">
                                                <div className="key__container__header">
                                                    <h3>Your service ID</h3>
                                                    <p>This is your unique service identifier. It is used to identify your service within the Naflows ecosystem. It is public.</p>
                                                </div>

                                                <Input
                                                    type="text"
                                                    value={service?.id || ""}
                                                    allowCopy={true}
                                                    onChange={() => { }}
                                                    editMode={false}
                                                    label="Service ID"
                                                    name="service-id"
                                                    autoComplete={false}
                                                    required={true}
                                                />
                                            </div>
                                            <div className="keys__container">
                                                <div className="key__container">
                                                    <div className="key__container__header">
                                                        <h3>
                                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q98 0 172.5 58.5T751-592q3 13-4.5 23T725-557q-72 13-118.5 68.5T560-360v160q0 17-11.5 28.5T520-160H260Zm420 0q-17 0-28.5-11.5T640-200v-120q0-17 11.5-28.5T680-360v-40q0-33 23.5-56.5T760-480q33 0 56.5 23.5T840-400v40q17 0 28.5 11.5T880-320v120q0 17-11.5 28.5T840-160H680Zm40-200h80v-40q0-17-11.5-28.5T760-440q-17 0-28.5 11.5T720-400v40Z" /></svg>
                                                            <span>Service API Key</span>
                                                        </h3>
                                                        <p>This API key is used to authenticate requests to the service. Keep it secure and do not share it publicly.</p>
                                                    </div>
                                                    <div className="buttons-container">
                                                        <button className="secondary-button" >Regenerate API Key</button>
                                                        <button className="primary-button" onClick={() => navigator.clipboard.writeText(service?.apiKey || "")}>Copy</button>
                                                    </div>
                                                </div>
                                                <div className="key__container">
                                                    <div className="key__container__header">
                                                        <h3>
                                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M444-360h72q9 0 15.5-7.5T536-384l-19-105q20-10 31.5-29t11.5-42q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 23 11.5 42t31.5 29l-19 105q-2 9 4.5 16.5T444-360Zm36 276q-7 0-13-1t-12-3q-135-45-215-166.5T160-516v-189q0-25 14.5-45t37.5-29l240-90q14-5 28-5t28 5l240 90q23 9 37.5 29t14.5 45v189q0 140-80 261.5T505-88q-6 2-12 3t-13 1Z" /></svg>
                                                            <span>Your Access Key</span>
                                                        </h3>
                                                        <p>This key is yours to use for accessing the service's API. Keep it secure and do not share it publicly.</p>
                                                    </div>
                                                    <div className="buttons-container">
                                                        <button className="secondary-button">Regenerate Access Key</button>
                                                        <button className="primary-button" onClick={() => navigator.clipboard.writeText(service?.details.access_key || "")}>Copy</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>

                {/* <SecurityMeasures service={service} /> */}


            </div>
        </div>
    )
}

export default ManageServiceOverview;