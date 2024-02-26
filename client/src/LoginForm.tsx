import React, { useState } from 'react';
import { login, signUp } from './firebase/AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSignup = () => {
    console.log('Signing up with:', email, password);

    // Call AuthContext
    signUp(email, password);
  };

  const handleLogin = () => {
    console.log('Logging in with:', email, password);

    // Call AuthContext
    login(email, password);
  };

  return (
    <div>
      <h2>Signup/Login Form</h2>
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
        <button onClick={handleSignup}>Sign Up</button>
        <button onClick={handleLogin}>Log In</button>
      </div>
    </div>
  );
};

export default LoginForm;
