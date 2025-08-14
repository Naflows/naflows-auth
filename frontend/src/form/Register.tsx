const RegisterForm = () => {
  return (
    <>
      <div className="inputs-container two-columns">
        <div className="inputs-container">
          <label htmlFor="firstName" className="text-size-20">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            placeholder="Enter your first name"
            className="text-size-20"
          />
        </div>
        <div className="inputs-container">
          <label htmlFor="lastName" className="text-size-20">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            placeholder="Enter your last name"
            className="text-size-20"
          />
        </div>
      </div>
      <div className="inputs-container">
        <label htmlFor="email" className="text-size-20">
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          className="text-size-20"
        />
        <label htmlFor="password" className="text-size-20">
          Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          className="text-size-20"
        />
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
