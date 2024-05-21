import { Button, Flex, List, Text, Title } from '@mantine/core';
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
          <Title order={3}>Navbar</Title>
        </Link>
        <div>
          <List type="unordered" listStyleType="none" pr={'2.5rem'}>
            {currentUser && (
              <Flex direction={'row'} ml={'1rem'}>
                <Link to={'/profile'}>
                  <List.Item display={'inline'}>Profile</List.Item>
                </Link>
                <Link to={'/'}>
                  <Button onClick={handleLogout}>Log out</Button>
                </Link>
              </Flex>
            )}

            {!currentUser && (
              // User not logged in
              <Flex align={'center'}>
                <Link to={'/login'}>
                  <List.Item
                    display={'inline'}
                    fz={'28px'}
                    fw={'bold'}
                    c="white"
                  >
                    Login
                  </List.Item>
                </Link>
                <Link to={'/login'}>
                  <List.Item>
                    <Button
                      p={0}
                      ml={'2.5rem'}
                      variant="gradient"
                      gradient={{ from: '#FFFFFF', to: '#E0E0E0' }}
                      radius={10}
                      w="135px"
                      h="50px"
                    >
                      <Text fz={'28px'} fw={'bold'} c={'black'}>
                        Sign up
                      </Text>
                    </Button>
                  </List.Item>
                </Link>
              </Flex>
            )}
          </List>

          {/* <ul className="list-none justify-end pr-10">
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
          </ul> */}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
