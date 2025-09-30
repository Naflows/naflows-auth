import type { ServicesForUserProps } from "../../../../types/ServicesForUserProps"
import type { AccountTabs } from "./types/account-tab.type";



const AccountDir = ({ service, tab, title, description  } : {
    service : ServicesForUserProps,
    tab : AccountTabs,
    title : string,
    description : string
}) => {
    return (
        <div className="service__management__header">
            <div className="service__management__dir">
                <a href="/account/services" className="service__management__dir__link">Services</a>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" /></svg>
                <a href={`/services/manage/${service.id}`} className="service__management__dir__link">{service.name}</a>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" /></svg>                    <span className="service__management__dir__current">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
            </div>
            <div className="service__management__header__content">
                <h2 className="service__management__title">
                    {title}
                </h2>
                <p className="service__management__subtitle">
                    {description}
                </p>
            </div>
        </div>

    )
}

export default AccountDir;