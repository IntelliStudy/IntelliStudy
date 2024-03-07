import { Link } from 'react-router-dom';

const SignUp = () => {
  return (
    <>
      <h1>Signup</h1>
      <div>
        <Link to={'/login'}>
          <button>Login</button>
        </Link>
      </div>
    </>
  );
};

export default SignUp;
