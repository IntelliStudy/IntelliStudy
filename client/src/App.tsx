import { LoadingOverlay, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { User, onAuthStateChanged } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import { Navbar, Quiz } from './components';
import { getCurrentlySignedInUserHandler } from './firebase/auth';
import { auth } from './firebase/firebase';
import { AuthPage, CourseDashboard, Home, Profile, StudySpot } from './pages';

// Context for managing user
export const UserContext = createContext<{
  currentUser: User | undefined;
  // setCurrentUser: (value: React.SetStateAction<User | undefined>) => void;
  isAuthLoading: boolean;
}>({
  currentUser: undefined,
  isAuthLoading: true,
  // setCurrentUser: () => {},
});

function useDisplayNavbar() {
  const location = useLocation();
  return location.pathname !== '/login';
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | undefined>(
    getCurrentlySignedInUserHandler
  );
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const displayNavbar = useDisplayNavbar();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user !== null) {
        setCurrentUser(user);
      } else {
        setCurrentUser(undefined);
      }
      setIsAuthLoading(false);
    });
  }, []);

  return (
    <>
      <MantineProvider>
        <UserContext.Provider value={{ currentUser, isAuthLoading }}>
          {displayNavbar && <Navbar />}

          {!currentUser && isAuthLoading && (
            <LoadingOverlay
              visible={true}
              zIndex={1000}
              overlayProps={{ radius: 'sm', blur: 2 }}
            />
          )}
          <LoadingOverlay
            visible={isAuthLoading}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 2 }}
          />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/studyspot" element={<StudySpot />} />
            <Route path="/course/:courseId" element={<CourseDashboard />} />
            <Route path="/course/:courseId/quiz" element={<Quiz />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </UserContext.Provider>
      </MantineProvider>
    </>
  );
}

export default App;
