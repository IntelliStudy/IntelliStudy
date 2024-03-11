import { User } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import {
  CourseDashboard,
  Home,
  LoginForm,
  Navbar,
  Profile,
  Quiz,
  StudySpot,
} from './components';
import { getCurrentlySignedInUserHandler } from './firebase/auth';

export const UserContext = createContext<{
  currentUser: User | undefined;
  setCurrentUser: (value: React.SetStateAction<User | undefined>) => void;
}>({
  currentUser: undefined,
  setCurrentUser: () => {},
});

function useDisplayNavbar() {
  const location = useLocation();
  return location.pathname !== '/login';
}

function App() {
  const [currentUser, setCurrentUser] = useState<User>();
  const displayNavbar = useDisplayNavbar();

  function login() {
    setCurrentUser(getCurrentlySignedInUserHandler);
  }

  return (
    <>
      <UserContext.Provider value={{ currentUser, setCurrentUser }}>
        {displayNavbar && <Navbar />}

        <button onClick={login}>User status</button>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/studyspot" element={<StudySpot />} />
          <Route
            path="/coursedashboard/:course"
            element={<CourseDashboard />}
          />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </UserContext.Provider>
    </>
  );
}

export default App;
