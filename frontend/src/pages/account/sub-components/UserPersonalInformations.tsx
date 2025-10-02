import { useEffect, useState } from "react";
import Input from "../../../global/components/Input";
import type { UserBodyProps } from "../../../types/UserBodyProps";
import axios from "axios";

const UserPersonalInformations = ({
  userData,
  setUserData
}: {
  userData: UserBodyProps | undefined;
  setUserData: React.Dispatch<React.SetStateAction<UserBodyProps | undefined>>;
}) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (userData && userData.id) {
      const res = axios.post(`${process.env.REACT_APP_API_URL}/client/secure/data/notifications`, {
        start : 0,
      }, {
        withCredentials: true
      }).then((response) => {
        if (response.data.status === 200) {
          setNotifications(response.data.data);
        }
      }).catch((error) => {
        console.error("Failed to fetch notifications:", error);
      });
    }
  }, [userData])

  if (userData) {

    return (
      <div className="user__body__personal-informations">
        <div className="row-20 row-no-wrap">
          <div className="user__body__section">
            <div className="service__actions__field__header">
              <h3 className="service__actions__field__title">Contact Information</h3>
              <span>
                Manage your contact information, including your email address and phone number
              </span>
            </div>
            <div className="user__details">
              <div className="inputs-container global__inputs col-20">
                <div className="inputs-container row-20 row-no-wrap">
                  <Input
                    label="Email Address"
                    value={userData.email}
                    type="email"
                    name="email"
                    required={true}
                    maxLength={100}
                    autoComplete={false}
                    fitContent={false}
                    onChange={(value) => { }}
                  />
                  <button className="secondary-button" style={{ height: '40px', alignSelf: 'center' }}>
                    Change Email
                  </button>
                </div>
                <div className="inputs-container row-20 row-no-wrap">
                  <Input
                    label="Phone Number"
                    value={userData.phone_number}
                    type="tel"
                    name="phone"
                    required={true}
                    maxLength={100}
                    autoComplete={false}
                    fitContent={false}
                    onChange={(value) => { }}
                  />
                  <button className="secondary-button" style={{ height: '40px', alignSelf: 'center' }}>
                    Change Phone
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="user__body__section">
            <div className="service__actions__field__header">
              <h3 className="service__actions__field__title">Notification</h3>
              <span>
                Manage your notification preferences, including email and SMS alerts
              </span>
            </div>
            <div className="user__body__section__content">
              <div className="notifications__list">
                {notifications.length === 0 && (
                  <span>No notifications available.</span>
                )}
                {notifications.map((notification: any) => (
                  <div key={notification.id} className={`notification__item ${notification.read ? 'read' : 'unread'}`}>
                    <div className="notification__item__header">
                      <span className="notification__item__title">{notification.title}</span>
                      <span className="notification__item__date">{new Date(notification.date).toLocaleString()}</span>
                    </div>
                    <div className="notification__item__body">
                      <p>{notification.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="user__body__section">
          <div className="service__actions__field__header">
            <h3 className="service__actions__field__title">Personal Informations</h3>
            <span>
              Manage your personal informations, including your address and phone number
            </span>
          </div>
          <div className="user__details">
            <div className="location__informations">
              <Input
                label="Country"
                value={userData.country}
                type="text"
                name="country"
                required={true}
                maxLength={56}
                autoComplete={false}
                editMode={true}
                fitContent={false}
                onChange={(value) => {
                  setUserData((prevData) => {
                    if (!prevData) return prevData;
                    return {
                      ...prevData,
                      country: value.toString().slice(0, 56)
                    };
                  });
                }}
              />
              <Input
                label="City"
                value={userData.city}
                type="text"
                name="city"
                required={true}
                maxLength={85}
                autoComplete={false}
                editMode={true}
                fitContent={false}
                onChange={(value) => {
                  setUserData((prevData) => {
                    if (!prevData) return prevData;
                    return {
                      ...prevData,
                      city: value.toString().slice(0, 85)
                    };
                  });
                }}
              />
              <Input
                label="Postal Code / ZIP"
                value={userData.postal_code}
                type="text"
                name="postal_code"
                required={true}
                maxLength={20}
                autoComplete={false}
                editMode={true}
                fitContent={false}
                onChange={(value) => {
                  setUserData((prevData) => {
                    if (!prevData) return prevData;
                    return {
                      ...prevData,
                      postal_code: value.toString().slice(0, 20)
                    };
                  });
                }}
              />
            </div>
            <div className="address__informations">
              <Input
                label="Address"
                value={userData.address}
                type="text"
                name="address"
                required={true}
                maxLength={100}
                autoComplete={false}
                editMode={true}
                fitContent={false}
                onChange={(value) => {
                  setUserData((prevData) => {
                    if (!prevData) return prevData;
                    return {
                      ...prevData,
                      address: value.toString().slice(0, 100)
                    };
                  });
                }}
              />
              <Input
                label="Address Complement"
                value={userData.address_complement}
                type="text"
                name="address_complement"
                required={false}
                maxLength={100}
                autoComplete={false}
                editMode={true}
                fitContent={false}
                onChange={(value) => {
                  setUserData((prevData) => {
                    if (!prevData) return prevData;
                    return {
                      ...prevData,
                      address_complement: value.toString().slice(0, 100)
                    };
                  });
                }}
              />
            </div>

          </div>
        </div>
      </div>
    );
  }
};

export default UserPersonalInformations;
