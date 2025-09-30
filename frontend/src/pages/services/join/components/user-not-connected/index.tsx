import type { UserBodyProps } from "../../../../../types/UserBodyProps";


const UserNotConnected = ({ userInfo } : {
    userInfo: UserBodyProps | null;
}) => {
    if (!userInfo) {
        return (
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
                        window.location.href = `/login?redirect?redirect=` + window.location.href;
                    }}>
                        <span>Log in to Naflows</span>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" /></svg>
                    </button>
                </div>
            </div>
        )
    }
}

export default UserNotConnected;