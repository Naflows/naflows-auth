import NAFLOWS_LOGO from "../public/assets/naflows-green.svg";
import { Link } from "./global/components/Link";
import "../public/root/index.scss";
import LoginForm from "./form/Login";
import { useState } from "react";
import RegisterForm from "./form/Register";

function App() {
  const [formType, setFormType] = useState("login");

  return (
    <>
      <div className="row-20 ">
        <div className="col-20">
          <div className="panel panel-image-only">
            <img
              src={NAFLOWS_LOGO}
              alt="Naflows Logo"
              style={{ height: "100px" }}
            />
          </div>
          <div className="panel">
            <h1>Learn More</h1>
            <div className="panel-links">
              <Link text="Pricing" />
              <Link text="Support" />
              <Link text="Terms of Service" />
              <Link text="Privacy Policy" />
            </div>
          </div>
        </div>
        <div className="panel width-35">
          <div className="panel-header">
            <h1>
              {formType === "login"
                ? "Welcome back to the NASS"
                : "Create an account"}
            </h1>
          </div>
          <form>{formType === "login" ? <LoginForm /> : <RegisterForm />}</form>
          <div className="panel-footer">
            <button
              className="secondary-button text-size-20"
              onClick={() => {
                setFormType(formType == "login" ? "register" : "login");
              }}
            >
              {formType === "login" ? "Sign up" : "Log in"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#1f1f1f"
              >
                <path d="M646-440H200q-17 0-28.5-11.5T160-480q0-17 11.5-28.5T200-520h446L532-634q-12-12-11.5-28t11.5-28q12-12 28.5-12.5T589-691l183 183q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L589-269q-12 12-28.5 11.5T532-270q-11-12-11.5-28t11.5-28l114-114Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
