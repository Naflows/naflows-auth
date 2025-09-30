import Input from "../../../global/components/Input";

const RegisterForm = () => {
  return (
    <>
      <div className="inputs-container two-columns">
        <div className="inputs-container">
          <Input
            label="First Name"
            type="text"
            name="firstName"
            required
            maxLength={100}
          />
        </div>
        <div className="inputs-container">
          <Input
            label="Last Name"
            type="text"
            name="lastName"
            required
            maxLength={100}
          />
        </div>
      </div>
      <div className="inputs-container">
        <Input
          label="Email"
          type="email"
          name="email"
          required
          maxLength={100}
        />
      </div>
      <div className="inputs-container">
        <Input
          label="Password"
          type="password"
          name="password"
          required
          maxLength={100}
        />
      </div>
      <div className="inputs-container">
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          required
          maxLength={100}
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

      <button
        className="primary-button text-size-20"
        type="submit"
        onSubmit={() => {}}
      >
        Register
      </button>
    </>
  );
};

export default RegisterForm;
