import React from "react";
import "../../../public/root/alert.scss";

export interface AlertContentProps {
  success: boolean;
  status: number;
  message: string | React.JSX.Element; // Message is a HTML body
  closeAlert: boolean;
  title?: string;
  displayCode?: boolean;
}
interface AlertProps {
  alert: AlertContentProps;
  setAlert: (alert: AlertProps["alert"]) => void;
}

const Alert = ({ alert, setAlert }: AlertProps) => {
  return (
    <div
      className={`global__alert__component ${alert.closeAlert ? "hidden" : ""}`}
    >
      <div className="global__alert__component__content">
        <div className="global__alert__body">
          <div className={`global___alert__component__header`}>
            <p
              className={`alert__header__banner ${
                alert.success ? "success" : "error"
              }`}
            >
              {alert.success
                ? "Success"
                : `Error ${alert.displayCode ? `${alert.status}` : ""}`}
            </p>
            <h3>{alert.title || (alert.success ? "Success" : "Error")}</h3>
          </div>
          <div className="global___alert__component__message">
            <p>{alert.message}</p>
          </div>
        </div>
        <button
          className="primary-button"
          onClick={() => setAlert({ ...alert, closeAlert: true })}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Alert;
