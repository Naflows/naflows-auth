const LoginForm = () => {
  return (
    <>
      <div className="inputs-container two-columns">
        <div className="inputs-container two-rows">
          <label className="text-size-20">Customer ID</label>
          <input
            className="text-size-20"
            type={"text"}
            placeholder="Enter your customer ID"
          />
        </div>
        <div className="inputs-container two-rows">
          <label className="text-size-20">Identifier</label>
          <input
            className="text-size-20"
            type={"text"}
            placeholder="Enter your identifier"
          />
        </div>
      </div>
      <div className="inputs-container">
        <label className="text-size-20">Password</label>
        <input
          className="text-size-20"
          type={"password"}
          placeholder="Enter your password"
        />
      </div>
      <button
        className="primary-button text-size-20"
        onClick={async () => {
          // Using fetch
          const response = await fetch("http://localhost:3000/client/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              identifier: "123456789",
              password: "W8JdVoy30xEa1hZ5aDVQ",
              userID:"1"
            }),
          });
          console.log(response);
        }}
      >
        Log in
      </button>
    </>
  );
};

export default LoginForm;
