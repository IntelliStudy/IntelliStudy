import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import {
  getCurrentlySignedInUserHandler,
  userLogoutHandler,
} from '../firebase/auth';

const Navbar = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const handleLogout = () => {
    console.log('Logging out user:', currentUser?.displayName);

    userLogoutHandler().then(() => {
      setCurrentUser(getCurrentlySignedInUserHandler);
    });
  };

  return (
    <>
      <nav className="sticky w-full flex bg-salmon top-0 justify-between px-4 h-12">
        <Link to={currentUser ? '/studyspot' : '/'}>
          <h3>Navbar</h3>
        </Link>
        <ul className="list-none justify-end">
          {currentUser && (
            <div className="flex flex-row ml-4">
              <Link to={'/profile'}>
                <li className="inline">Profile</li>
              </Link>
              <Link to={'/'}>
                <div>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </Link>
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
