import { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  deleteUserHandler,
  googleLoginHandler,
  loginHandler,
  signUpHandler,
  userLogoutHandler,
} from '../firebase/auth';

const LoginForm = () => {
  const [create, setCreate] = useState(true);
  const [email, setEmail] = useState('');
  const [fName, setfName] = useState('');
  const [lName, setlName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

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
    console.log('Signing up with:', email, password, fName, lName);

    signUpHandler(email, password, fName, lName, () => {
      navigate('/studyspot');
    });
  };

  const handleLogin = () => {
    console.log('Logging in with:', email, password);

    loginHandler(email, password, () => {
      navigate('/studyspot');
    });
  };

  const handleGoogleLogin = () => {
    console.log('Logging in with Google');

    googleLoginHandler(() => {
      navigate('/studyspot');
    });
  };

  const handleAccountDelete = () => {
    console.log('Deleting user account');

    deleteUserHandler();
  };

  const handleLogout = () => {
    console.log('Logging out');

    userLogoutHandler();
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
        <div>
          <button onClick={handleAccountDelete}>Delete account</button>
        </div>
        <div>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <div>
          <Link to={'/studyspot'}>
            <button>Study Spot</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
