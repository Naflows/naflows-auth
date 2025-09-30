import axios from "axios";
import { useState } from "react";
import Input from "../../../../global/components/Input";
import Alert, {
  type AlertContentProps,
} from "../../../../global/error-alert/Alert";

const Mailing = () => {
  const handleSubscribe = async (email: string) => {
    const response = await axios.get(
      `${process.env.DUMMY_API_URL_DEV}/public/subscribe-mailing`,
      { params: { email } }
    );
    const data = await response.data;
    setAlert({
      status: response.status,
      message: data.message,
      success: data.success,
      closeAlert: false,
      displayCode: false,
      title: data.success ? "Subscription Successful" : "Subscription Failed",
    });
  };

  const [alert, setAlert] = useState<AlertContentProps>({
    status: 0,
    message: "",
    success: false,
    closeAlert: true,
    displayCode: false,
  });

  return (
    <>
      <Alert alert={alert} setAlert={setAlert} />
      <div className="nass_homepage__box nass_mailing__list">
        <div className="nass_homepage__box__header">
          <div className="nass_home__box__header__subtitle">
            <span className="nass_service__info__item__title">Join our mailing list</span>
            <span className="nass_service__info__item__title__subtitle">
              Be notified when we open up for beta testing and get updates on
              the NASS
            </span>
          </div>
        </div>
        <div className="nass_homepage__box__content">
          <div className="mailing__input__container">
            <Input
              label="Email address"
              type="email"
              name="email"
              required={true}
              value=""
            />
            <div className="nass_mailing__list__button_container">
              <button
                className="primary-button width-100-auto"
                onClick={() => {
                  const emailInput = document.querySelector(
                    'input[name="email"]'
                  ) as HTMLInputElement;
                  const checkbox = document.getElementById(
                    "subscribe-checkbox"
                  ) as HTMLInputElement;
                  if (!checkbox.checked) {
                    setAlert({
                      status: 400,
                      title: "Terms and Conditions",
                      message: (
                        <>
                          You must agree to receive email updates about the NASS
                          to subscribe to the mailing list and accept our{" "}
                          <a href="https://naflows.com/legal/">
                            terms and conditions
                          </a>
                          .
                        </>
                      ),
                      success: false,
                      closeAlert: false,
                      displayCode: false,
                    });
                    return;
                  }
                  if (emailInput && emailInput.value) {
                    handleSubscribe(emailInput.value);
                  }
                }}
              >
                Subscribe
              </button>
            </div>
          </div>
          <label className="checkbox-container">
            <input type="checkbox" required id="subscribe-checkbox" />
            <span>
              I agree to receive email updates about the NASS and accept the{" "}
              <a href="https://naflows.com/legal/">terms and conditions</a>.
            </span>
          </label>
        </div>
      </div>
    </>
  );
};

export default Mailing;
