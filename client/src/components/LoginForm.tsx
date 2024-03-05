import { ChangeEvent, useState } from "react";
import { login, signUp } from "../firebase/auth";

const LoginForm = () => {
  const [create, setCreate] = useState(true);
  const [email, setEmail] = useState("");
  const [fName, setfName] = useState("");
  const [lName, setlName] = useState("");
  const [password, setPassword] = useState("");

  const handlefNameChange: any = (event: ChangeEvent<HTMLInputElement>) => {
    setfName(event.target.value);
  };

  const handlelNameChange: any = (event: ChangeEvent<HTMLInputElement>) => {
    setlName(event.target.value);
  };

  const handleEmailChange: any = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSignup = () => {
    console.log("Signing up with:", email, password, fName, lName);

    signUp(email, password, fName, lName);
  };

  const handleLogin = () => {
    console.log("Logging in with:", email, password);

    login(email, password);
  };

  return (
    <>
      <div>
        <h2>Signup/Login Form</h2>
        {create && (
          <>
            <div>
              <label>First Name:</label>
              <input type="text" value={fName} onChange={handlefNameChange} />
            </div>
            <div>
              <label>Last Name:</label>
              <input type="text" value={lName} onChange={handlelNameChange} />
            </div>
          </>
        )}
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={handleEmailChange} />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div>
          {create ? (
            <button onClick={handleSignup}>Sign Up</button>
          ) : (
            <button onClick={handleLogin}>Log In</button>
          )}
        </div>
        Already have an account?
        <button onClick={() => setCreate(!create)}>
          { create ? "Log In": "Sign Up"}
        </button>
      </div>
    </>
  );
};

export default LoginForm;
