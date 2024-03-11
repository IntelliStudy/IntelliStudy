import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import {
  getCurrentlySignedInUserHandler,
  userLogoutHandler,
} from '../firebase/auth';

const Navbar = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  if (currentUser) {
    console.log('Navbar: user logged in');
  } else {
    console.log('Navbar: user not logged in');
  }

  const handleLogout = () => {
    console.log('Logging out');

    userLogoutHandler().then(() => {
      setCurrentUser(getCurrentlySignedInUserHandler);
    });
  };

  return (
    <>
      <nav className="sticky w-full flex bg-salmon top-0 justify-between px-4 h-12">
        <Link to={'/studyspot'}>
          <h3>Navbar</h3>
        </Link>
        <ul className="list-none justify-end">
          {currentUser && (
            <div className="flex flex-row ml-4">
              <Link to={'/profile'}>
                <li className="inline">Profile</li>
              </Link>
              <div>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          )}

          {!currentUser && (
            <div>
              <Link to={'/login'}>
                <li className="inline">Login</li>
              </Link>
              <Link to={'/login'}>
                <li className="inline ml-4">Signup</li>
              </Link>
            </div>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
