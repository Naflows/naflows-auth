import type { ServicesForUserProps } from "../../../../../../../types/ServicesForUserProps";


const QuickActions = ({
    service
}: {
    service: null | ServicesForUserProps
}) => {
    if (service) {
        return (
            <div className="user__body__section service__quick__actions">
                <div className="quick__actions">
                    <div className="buttons-container">
                        <button className="primary-button width-fit" disabled={service?.active != "ACTIVE"}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m653-208-46 46q-17 17-42 17.5T522-162q-17-17-17-42.5t17-42.5l46-46q-4-11-6-23t-2-24q0-58 41-99t99-41q9 0 18 .5t17 3.5q11 4 13.5 16.5T743-439l-43 43q-11 11-11 28t11 28q11 11 28 11t28-11l43-43q8-8 20.5-5.5T836-375q3 8 3.5 17t.5 18q0 58-41 99t-99 41q-13 0-24.5-2t-22.5-6ZM480-760q-117 0-198.5 81.5T200-480q0 72 32.5 132t87.5 98v-70q0-17 11.5-28.5T360-360q17 0 28.5 11.5T400-320v160q0 17-11.5 28.5T360-120H200q-17 0-28.5-11.5T160-160q0-17 11.5-28.5T200-200h54q-62-50-98-122.5T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q65 0 139 38t195 187q11 13 3.5 28.5T792-563q-16 7-32 .5T739-585q-20-68-91.5-121.5T480-760Z" /></svg>
                            <span className="button__text__hide">
                                Reset Service
                            </span>
                        </button>
                        <button className="primary-button width-fit" disabled={!service}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M240-320v-320q0-33 23.5-56.5T320-720h320q33 0 56.5 23.5T720-640v320q0 33-23.5 56.5T640-240H320q-33 0-56.5-23.5T240-320Z" /></svg>
                            <span className="button__text__hide">
                                Stop Service
                            </span>
                        </button>
                        <button className="primary-button width-fit" disabled={!service}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M364-590q22-23 51.5-36.5T480-640q35 0 64.5 13.5T596-590l202-113-279-155q-18-11-39-11t-39 11L162-703l202 113Zm76 488v-223q-52-14-86-56.5T320-480q0-11 1-21t4-19L120-635v308q0 22 11 40.5t30 29.5l279 155Zm40-298q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400Zm40 298 279-155q19-11 30-29.5t11-40.5v-308L635-520q3 10 4 19.5t1 20.5q0 56-34 98.5T520-325v223Z" /></svg>
                            <span className="button__text__hide">
                                Renew Token
                            </span>
                        </button>
                        <button className="primary-button width-fit" disabled={!service}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-240v20q0 8 6 14t14 6h40q8 0 14-6t6-14v-20h40q17 0 28.5-11.5T600-280v-120q0-17-11.5-28.5T560-440H440v-40h120q17 0 28.5-11.5T600-520q0-17-11.5-28.5T560-560h-40v-20q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14v20h-40q-17 0-28.5 11.5T360-520v120q0 17 11.5 28.5T400-360h120v40H400q-17 0-28.5 11.5T360-280q0 17 11.5 28.5T400-240h40ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h360l200 200v520q0 33-23.5 56.5T720-80H240Zm320-720v120q0 17 11.5 28.5T600-640h120L560-800Z" /></svg>
                            <span className="button__text__hide">
                                Service Billing
                            </span>
                        </button>
                    </div>
                    <button className="secondary-button width-100-auto" disabled={!service}>
                        View Logs
                    </button>
                </div>

            </div>
        )
    }
}

export default QuickActions;