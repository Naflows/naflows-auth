import { useState } from "react";
import "../../../public/root/pages/home/index.scss";
import Mailing from "./components/Mailing";
import Status, { type ServiceStatus } from "./components/Status";
import HomeAdvantage from "./components/HomeAdvantage";

const Home = () => {
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus | null>(
    null
  );



  return (
    <div className="nass__home__page">

      <div className="global__home__header">
        <div className="header__head">
          <img
            src="https://naflows.com/public/assets/naflows_full_logotype.png"
            alt="Naflows Logo"
          />
        </div>

        <div className="header__navigation">
          <button className="secondary-button" onClick={() => {
            window.location.href = "/docs";
          }}>Documentation</button>
          <button className="secondary-button" onClick={() => {
            window.location.href = "https://github.com/Naflows/naflows-auth";
          }}>
            Source Code
          </button>
          <button className="secondary-button" onClick={() => {
            window.location.href = "https://discord.gg/5k8aFS9DbK";
          }}>
            Join the commmunity
          </button>
          <button className="secondary-button inactive" onClick={() => {
            window.location.href = "/docs";
          }}>
            Demo
          </button>
        </div>
        <div className="header__actions">
          <button className="primary-button" onClick={() => {
            window.location.href = "/login";
          }}>Login to the NASS</button>

          <div className="status__container">
            <Status
              serviceStatus={serviceStatus}
              setServiceStatus={setServiceStatus}
            />
          </div>
        </div>
      </div>
      <div className="head__global__title">

        <div className="title__headers">
          <h3 className="moving--lighted--title">
            {"Backend Solution via SSO for Devs'".split(" ").map((word, wordIndex, arr) => (
              <span key={wordIndex} className="word" style={{
                animationDelay: `${wordIndex * 0.3}s`
              }}>
                {word.split("").map((char, charIndex) => (
                  <span key={charIndex} className="char">{char}</span>
                ))}
                {wordIndex < arr.length - 1 && <span className="char">&nbsp;</span>}
              </span>
            ))}
          </h3>

          <h5>Built by <span className="nass__author">Naflows</span> with transparency and scalability in mind</h5>
        </div>
      </div>


      <div className="naflows__logo__separator">
        <img className="nass__home__background" src="/public/assets/backgrounds/nass-home.png" alt="Home Background" />

      </div>

      <div className="nass__home__head">

        <div className="nass_welcome__informations">
          <div className="nass_homepage__box">
            <div className="nass_homepage__box__header">
              <div className="nass_home__box__header__subtitle">
                <span className="nass_service__info__item__title">Welcome to the Naflows Auth Service (NASS)</span>
                <span className="nass_service__info__item__title__subtitle">
                  Your trusted authentication solution
                </span>
              </div>
            </div>
            <p className="nass_home__box__description">
              The NASS is an <span id="colorful">open-source authentication service </span>
              designed to provide <span id="colorful">secure</span>, <span id="colorful">privacy-focused</span>, and <span id="colorful">user-centric</span> authentication for your applications. Whether you're a developer looking to
              integrate authentication into your app or a user seeking a
              trustworthy service, the NASS has you covered.<br />
              Explore our features, learn about our commitment to privacy,
              and discover how the NASS can enhance your digital experience with a <span id="colorful">single-account solution for multiple services</span>.
            </p>
          </div>
        </div>

        <div className="nass_home__activity">
          {serviceStatus != null && <Mailing />}
        </div>
      </div>

      <div className="nass_homepage__content">
        <div className="nass_advantages">
          <HomeAdvantage
            title="Open Source"
            content={
              <>
                <div className="content__box">
                  <div className="content__item">
                    <h2 className="content__title">Available Publicly</h2>
                    <p className="content__description">
                      The NASS is fully open source, allowing you to inspect,
                      modify, and contribute to its codebase. We believe in
                      transparency and community collaboration.
                    </p>
                  </div>
                  <div className="content__item">
                    <h2 className="content__title">Developers </h2>
                    <p className="content__description">
                      Contributing to the NASS is easy. Find us on GitHub and
                      help us improve the platform, system, and services.
                      <br />
                      Long term, we aim to create a community-driven project
                      where developers can share ideas and collaborate on new
                      features.
                    </p>
                  </div>
                </div>
                <button
                  className="secondary-button"
                  style={{
                    width: "100%",
                  }}
                  onClick={() => {
                    window.open("https://github.com/Naflows/naflows-auth");
                  }}
                >
                  Contribute on GitHub
                </button>
              </>
            }
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path d="M612-85q-12 12-28.5 12T555-85l-87-87q-12-12-12-28t12-28l87-87q12-12 28.5-12t28.5 12q12 12 12 28t-12 28l-59 59 59 59q12 12 12 28t-12 28Zm136 0q-12-12-12-28t12-28l59-59-59-59q-12-12-12-28t12-28q12-12 28.5-12t28.5 12l87 87q12 12 12 28t-12 28l-87 87q-12 12-28.5 12T748-85Zm-588-75q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h207q16 0 30.5 6t25.5 17l57 57h320q33 0 56.5 23.5T880-640v160q0 17-11.5 28.5T840-440H600q-100 0-170 70t-70 170q0 17-11.5 28.5T320-160H160Z" />
              </svg>
            }
            imgLink="/home-page/open-source.png"
          />
          <HomeAdvantage
            title="Privacy-Focused"
            content={
              <>
                <div className="content__box">
                  <div className="content__item">
                    <h2 className="content__title">Data Protection</h2>
                    <p className="content__description">
                      We prioritize your privacy. The NASS is designed to
                      minimize data collection and ensure that your personal
                      information is secure.
                    </p>
                  </div>
                  <div className="content__item">
                    <h2 className="content__title">Transparency</h2>
                    <p className="content__description">
                      Our open-source nature allows you to verify how your data
                      is handled by us and the services hosted through the NASS.
                      We are committed to being transparent about our data
                      practices.
                    </p>
                  </div>
                  <div className="content__item">
                    <h2 className="content__title">User Control</h2>
                    <p className="content__description">
                      You have full control over your data. The NASS allows you
                      to manage your privacy settings and choose what
                      information you share.
                      <br />
                      Also, with our upcoming self-hosting option, you can run
                      the NASS on your own server, giving you complete control
                      over your data.
                    </p>
                  </div>
                </div>
              </>
            }
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path d="M444-360h72q9 0 15.5-7.5T536-384l-19-105q20-10 31.5-29t11.5-42q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 23 11.5 42t31.5 29l-19 105q-2 9 4.5 16.5T444-360Zm36 276q-7 0-13-1t-12-3q-135-45-215-166.5T160-516v-189q0-25 14.5-45t37.5-29l240-90q14-5 28-5t28 5l240 90q23 9 37.5 29t14.5 45v189q0 140-80 261.5T505-88q-6 2-12 3t-13 1Z" />
              </svg>
            }
            imgLink="/home-page/privacy-focused.png"
          />
          <HomeAdvantage
            title="User-Centric Design"
            content={
              <>
                <div className="content__box">
                  <div className="content__item">
                    <h2 className="content__title">Intuitive Interface</h2>
                    <p className="content__description">
                      The NASS is built with a focus on user experience. Our
                      intuitive interface makes it easy for users of all
                      technical levels to navigate and utilize the platform
                      effectively.
                    </p>
                  </div>
                  <div className="content__item">
                    <h2 className="content__title">One-Paged Design</h2>
                    <p className="content__description">
                      Our one-paged design ensures that all essential features
                      and information are accessible without the need for
                      complex navigation. This streamlined approach enhances
                      usability and reduces the learning curve for new users.
                    </p>
                  </div>
                  <div className="content__item">
                    <h2 className="content__title">Responsive Design</h2>
                    <p className="content__description">
                      The NASS features a responsive design that works
                      seamlessly across all devices, including desktops,
                      tablets, and smartphones. This ensures that you can access
                      your services anytime, anywhere.
                    </p>
                  </div>
                </div>
              </>
            }
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path d="M120-120q-33 0-56.5-23.5T40-200v-80q0-33 23.5-56.5T120-360h240q33 0 56.5 23.5T440-280v80q0 33-23.5 56.5T360-120H120Zm480 0q-33 0-56.5-23.5T520-200v-560q0-33 23.5-56.5T600-840h240q33 0 56.5 23.5T920-760v560q0 33-23.5 56.5T840-120H600Zm120-120q17 0 28.5-11.5T760-280q0-17-11.5-28.5T720-320q-17 0-28.5 11.5T680-280q0 17 11.5 28.5T720-240ZM120-440q-33 0-56.5-23.5T40-520v-240q0-33 23.5-56.5T120-840h240q33 0 56.5 23.5T440-760v240q0 33-23.5 56.5T360-440H120Zm160-200q17 0 28.5-11.5T320-680q0-17-11.5-28.5T280-720q-17 0-28.5 11.5T240-680q0 17 11.5 28.5T280-640ZM150-520h100q12 0 18-11t-2-21l-50-67q-6-8-16-8t-16 8l-50 67q-8 10-2 21t18 11Z" />
              </svg>
            }
            imgLink="/home-page/user-centric-design.png"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
