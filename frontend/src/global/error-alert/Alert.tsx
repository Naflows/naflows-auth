import "../../../public/root/error-alert.scss";

interface AlertProps {
  alert: {
    success : boolean;
    status : number;
    message : string;
    closeAlert: boolean;
  };
  setAlert: (alert: AlertProps["alert"]) => void;
}

const Alert = ({ alert, setAlert }: AlertProps) => {
  return (
    <div
      className={`global__alert__component ${alert.closeAlert ? "hidden" : ""}`}
    >
      <div className="global__alert__component__content">
        <div className="global___alert__component__header">
          <svg
            width="142"
            height="142"
            viewBox="0 0 142 142"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="28.2842"
              y="98.9949"
              width="100"
              height="20"
              rx="5"
              transform="rotate(-45 28.2842 98.9949)"
              fill="#3E4DED"
            />
            <rect
              x="98.9949"
              y="113.137"
              width="100"
              height="20"
              rx="5"
              transform="rotate(-135 98.9949 113.137)"
              fill="#3E4DED"
            />
          </svg>

          <strong>{alert.success ? "" : `Error ${alert.status}`}</strong>
        </div>
        <p>{alert.message}</p>
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
