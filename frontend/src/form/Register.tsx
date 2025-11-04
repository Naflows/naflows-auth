import Input from "../global/components/Input";

const RegisterForm = ({
  setFormType,
}: {
  setFormType: (formType: "login" | "register") => void;
}) => {
  return (
    <>
      <div className="inputs-container two-columns">
        <div className="inputs-container ">
          <Input
            label="First Name"
            type="text"
            name="firstName"
            required
            maxLength={100}
            fitContent={false}
          />
        </div>
        <div className="inputs-container">
          <Input
            label="Last Name"
            type="text"
            name="lastName"
            required
            maxLength={100}
            fitContent={false}
          />
        </div>
      </div>
      <div className="inputs-container two-columns">
        <Input
          label="Email"
          type="email"
          name="email"
          required
          maxLength={100}
          fitContent={false}
        />
        <Input
          label="Phone Number"
          type="tel"
          name="phoneNumber"
          required
          maxLength={100}
          fitContent={false}
        />
      </div>
      <div className="inputs-container two-columns">
        <Input
          label="Password"
          type="password"
          name="password"
          required
          maxLength={100}
          fitContent={false}
          displayMaxChar={true}
        />
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          required
          maxLength={100}
          fitContent={false}
          displayMaxChar={true}
        />
      </div>

      <div className="global__terms__and__conditions">
        <label className="checkbox-container">
          <input type="checkbox" required />I agree to <a href="https://naflows.com/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="https://naflows.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
        </label>
        <label className="checkbox-container">
          <input type="checkbox" required />I want to receive email updates & promotions
        </label>
      </div>

      <div className="buttons-container">
        <button
          className="primary-button text-size-20 width-100-auto"
        >
          Register
        </button>
        <span className="separator">Or</span>
        <button className="secondary-button  text-size-20 width-100-auto" onClick={() => {
          setFormType("login");
        }}>
          Log in
        </button>
      </div>
    </>
  );
};

export default RegisterForm;
