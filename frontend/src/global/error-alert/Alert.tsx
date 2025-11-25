import React from "react";
import "../../../public/root/alert.scss";
import type { AlertProps } from "../../types/AlertContentProps.type";



const errors = {
  400: "Bad Request - Your request is invalid.",
  401: "Unauthorized - Access is denied.",
  403: "Forbidden - The resource is forbidden.",
  404: "Not Found - The specified resource could not be found.",
  409: "Conflict - The request could not be completed due to a conflict.",
  500: "Internal Server Error - We had a problem with our server.",
  502: "Bad Gateway - The server was acting as a gateway or proxy and received an invalid response from the upstream server.",
  503: "Service Unavailable - The server is currently unavailable (overloaded or down).",
  504: "Gateway Timeout - The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.",
}


const Alert = ({ alert, setAlert }: AlertProps) => {
  return (
    <div
      className={`global__alert__component ${alert.closeAlert ? "hidden" : ""}`}
    >
      <div className={`global__alert__component__content ${alert.success ? "success" : "error"}`}>
        <div className="global__alert__body">
          <div className={`global___alert__component__header`}>
            <p
              className={`alert__header__banner ${alert.success ? "success" : "error"
                }`} style={{
                  display: alert.displaySuccess === false ? "none" : "block"
                }}
            >
              {alert.success
                ? "Success"
                : `Error ${alert.displayCode ? `${alert.status}` : ""}`}
            </p>

            <h3 className={`${!alert.displaySuccess && "enhanced"}`}>{alert.title || (alert.success ? "Success" : "Error")}</h3>
          </div>
          <div className="global___alert__component__message">
            {alert.displayCode && (
              <span className="error__code__explainer">
                {alert.displayCode
                  ? errors[alert.status as keyof typeof errors] || "An error occurred."
                  : alert.success ? "The operation was completed successfully."
                    : ""}
              </span>
            )}
            <p>{alert.message}</p>
          </div>
        </div>
        <div className="buttons-container">
          <button
            className={
              !alert.customClose?.additionalButton ? "primary-button" : "secondary-button"
            }
            onClick={() => {
              if (alert.customClose) {
                alert.customClose.action();
              } else {
                setAlert({ ...alert, closeAlert: true })
              }
            }}>
            {alert.customClose ? alert.customClose.text : "Close"}
          </button>
          {alert.customClose && alert.customClose.additionalButton && (
            <button
              className={alert.customClose.additionalButton.class || "secondary-button"}
              onClick={alert.customClose.additionalButton.action}
            >
              {alert.customClose.additionalButton.content}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert;
