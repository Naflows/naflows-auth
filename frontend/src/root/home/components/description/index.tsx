

const HomeDescription = () => {
    return (
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
            <div className="nass_homepage__box nass__connect">
                <div className="nass_homepage__box__header">
                    <div className="nass_home__box__header__subtitle">
                        <span className="nass_service__info__item__title">
                            Already a customer?
                        </span>
                        <span className="nass_service__info__item__title__subtitle">
                            If you are, you can access your account
                        </span>
                    </div>
                </div>
                <div className="nass_homepage__buttons">
                    <button className="primary-button width-100-auto" onClick={() => {
                        window.location.href = "/login";
                    }}>Login</button>
                    <button className="secondary-button width-100-auto" onClick={() => {
                        window.location.href = "/account/services";
                    }}>View services</button>
                </div>
            </div>
        </div>
    )
}

export default HomeDescription;