import { ChangeEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import {
  getCurrentlySignedInUserHandler,
  googleLoginHandler,
  loginHandler,
  signUpHandler,
} from '../firebase/auth';

const LoginForm = () => {
  const [create, setCreate] = useState(true);
  const [email, setEmail] = useState('');
  const [fName, setfName] = useState('');
  const [lName, setlName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { currentUser, setCurrentUser } = useContext(UserContext);

  const handlefNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setfName(event.target.value);
  };

  const handlelNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setlName(event.target.value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  // Sign up with email and password
  const handleSignup = () => {
    console.log('Signing up with:', email, password, fName, lName);

    signUpHandler(email, password, fName, lName, () => {
      navigate('/studyspot');
    }).then(() => {
      setCurrentUser(getCurrentlySignedInUserHandler);
    });
  };

  // Login with email and password
  const handleLogin = () => {
    console.log('Logging in with:', email, password);

    loginHandler(email, password, () => {
      navigate('/studyspot');
    }).then(() => {
      setCurrentUser(getCurrentlySignedInUserHandler);
    });
  };

  // Sign up or login using Google account
  const handleGoogleLogin = () => {
    console.log('Signing up / logging in with Google');

    googleLoginHandler(() => {
      navigate('/studyspot');
    }).then(() => {
      setCurrentUser(getCurrentlySignedInUserHandler);
    });
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
            <br />
            <div>
              <label>Last Name:</label>
              <input type="text" value={lName} onChange={handlelNameChange} />
            </div>
          </>
        )}
        <br />
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={handleEmailChange} />
        </div>
        <br />
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
          {create ? 'Log In' : 'Sign Up'}
        </button>
        <div>
          <button onClick={handleGoogleLogin}>Google Auth</button>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
