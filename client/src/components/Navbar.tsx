import { Button } from '@mantine/core';
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
      <nav className="sticky w-full flex top-0 justify-between items-center px-4 h-[80px] bg-gradient-to-r from-navbarDark to-navbarLight">
        <Link to={currentUser ? '/studyspot' : '/'}>
          <h3>Navbar</h3>
        </Link>
        <div>
          <ul className="list-none justify-end pr-10">
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
              // User not logged in
              <div className="flex items-center">
                <Link to={'/login'}>
                  <li className="inline text-navbarText font-bold text-white">
                    Login
                  </li>
                </Link>
                <Link to={'/login'}>
                  <li className="inline">
                    <Button
                      className="p-0 mx-auto ml-10"
                      variant="gradient"
                      gradient={{ from: '#FFFFFF', to: '#E0E0E0' }}
                      radius={10}
                      w="135px"
                      h="50px"
                    >
                      <p className="text-navbarText font-bold text-black">
                        Sign up
                      </p>
                    </Button>
                  </li>
                </Link>
              </div>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
