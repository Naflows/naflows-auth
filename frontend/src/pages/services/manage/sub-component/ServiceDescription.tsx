import type { ServicesForUserProps } from "../../../../types/ServicesForUserProps";
import "../../../../../public/root/pages/services/manage/sub-components/ServiceDescription.scss";
import type { ServicesBodyProps } from "../../../../types/ServicesBodyProps";

const ServiceDescription = ({
  service,
  publicDisplay = false,
}: {
  service: ServicesForUserProps | ServicesBodyProps | null;
  publicDisplay?: boolean;
  smallBody?: boolean;
  userManagement?: boolean;
  owned?: boolean;
}) => {
  console.log("Rendering ServiceDescription with service:", service);
  if (service) {
    return (
  
      <div className="user__body__section service__description__section">
        <div className="service__description">
          <div className="services__section__content description__content">
            <img src={service.banner || "/default-service-banner.png"} alt="Service Banner" className="service__banner" />
            <div className="service__description__header">
              <div className="service__description__header__content">
                <div className="service__description__pseudo__image">
                  {service.picture ? (
                    <img src={service.picture} alt={service.name} />
                  ) : (
                    service.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="service__description__head">
                  <div className="service__description__name">
                    <h2>
                      <span className="service__name">{service.name}</span>
                      <div className="service__creation">
                        <span>{service.joined_at ? "Joined" : "Created"} on </span>
                        {new Date(
                          service.joined_at
                            ? service.joined_at
                            : service.created_at ?? ""
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
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
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M40-272q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v32q0 33-23.5 56.5T600-160H120q-33 0-56.5-23.5T40-240v-32Zm698 112q11-18 16.5-38.5T760-240v-40q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v40q0 33-23.5 56.5T840-160H738ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113Z" /></svg>
                        {service.details.users} user{service.details.users > 1 ? "s" : ""}
                      </span>
                      <span style={{ display: service.details.official ? "inline-flex" : "none" }} className="official-badge" title="Official Service">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m438-452-56-56q-12-12-28-12t-28 12q-12 12-12 28.5t12 28.5l84 85q12 12 28 12t28-12l170-170q12-12 12-28.5T636-593q-12-12-28.5-12T579-593L438-452Zm42 368q-7 0-13-1t-12-3q-135-45-215-166.5T160-516v-189q0-25 14.5-45t37.5-29l240-90q14-5 28-5t28 5l240 90q23 9 37.5 29t14.5 45v189q0 140-80 261.5T505-88q-6 2-12 3t-13 1Z" /></svg>
                        Naflows-Owned Service
                      </span>
                    </div>
                  </div>
                  <div className="service__description__content">
                    <p>{service.description || "No description provided."}</p>
                  </div>


                </div>
              </div>
            </div>
            <div className="buttons-container" style={{
              display: publicDisplay ? "none" : "flex",
            }}>
              <button className="secondary-button" onClick={() => {
                window.open(`/services/join/${service.id}`)?.focus();
              }}>
                <span>Share</span>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240q17 0 28.5 11.5T480-800q0 17-11.5 28.5T440-760H200v560h560v-240q0-17 11.5-28.5T800-480q17 0 28.5 11.5T840-440v240q0 33-23.5 56.5T760-120H200Zm560-584L416-360q-11 11-28 11t-28-11q-11-11-11-28t11-28l344-344H600q-17 0-28.5-11.5T560-800q0-17 11.5-28.5T600-840h200q17 0 28.5 11.5T840-800v200q0 17-11.5 28.5T800-560q-17 0-28.5-11.5T760-600v-104Z" /></svg>
              </button>
              <button className="primary-button" style={{
                width: "100%",
              }} onClick={() => {
                window.location.href = `/services/manage/${service.id}/edit`;
              }}>
                <span>Edit Service</span>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" /></svg>
              </button>
            </div>
            <div className="buttons-container" style={{
              flexDirection: "column",
              gap: "5px",
              display: !publicDisplay ? "none" : "flex",
            }}>
              <button className="primary-button width-100-auto" onClick={() => {
                window.open(service?.public?.contact_email || "https://www.naflows.com/support", "_blank");
              }}>
                <span>Contact Service</span>
              </button>
              <button className="secondary-button width-100-auto" onClick={() => {
                window.open(service?.public?.privacy_policy_url || "https://www.naflows.com/support", "_blank");
              }}>
                <span>Service Privacy Policy</span>
              </button>
              <button className="secondary-button width-100-auto" onClick={() => {
                window.open(service?.public?.terms_of_service_url || "https://www.naflows.com/support", "_blank");
              }}>
                <span>Terms of Service</span>
              </button>
            </div>

          </div>
        </div>

        
      </div>
    );
  }
};

export default ServiceDescription;
