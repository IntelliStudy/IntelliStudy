import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { User, onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import {
  CourseDashboard,
  Home,
  LoginForm,
  Navbar,
  Profile,
  Quiz,
  StudySpot,
} from "./components";
import { getCurrentlySignedInUserHandler } from "./firebase/auth";
import { auth } from "./firebase/firebase";

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
  return location.pathname !== "/login";
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

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/studyspot" element={<StudySpot />} />
            <Route
              path="/coursedashboard/:courseId"
              element={<CourseDashboard />}
            />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </UserContext.Provider>
      </MantineProvider>
    </>
  );
}

export default App;
