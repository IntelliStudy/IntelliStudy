import { LoadingOverlay, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { ModalsProvider } from "@mantine/modals";
import "@mantine/notifications/styles.css";
import { User, onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { Navbar, Quiz } from "./components";
import { getCurrentlySignedInUserHandler } from "./firebase/auth";
import { auth } from "./firebase/firebase";
import { AuthPage, CourseDashboard, Home, StudySpot } from "./pages";

interface UserContextType {
  currentUser: User | undefined;
  isAuthLoading?: boolean;
  setCurrentUser?: (user: User | null) => void;
}

// Context for managing user
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

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
        <ModalsProvider>
          <UserContext.Provider
            value={{ currentUser, setCurrentUser, isAuthLoading }}
          >
            {displayNavbar && <Navbar />}

            {!currentUser && isAuthLoading && (
              <LoadingOverlay
                visible={true}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
              />
            )}
            <LoadingOverlay
              visible={isAuthLoading}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/studyspot" element={<StudySpot />} />
              <Route path="/course/:courseId" element={<CourseDashboard />} />
              <Route path="/course/:courseId/quiz/:quizId" element={<Quiz />} />
            </Routes>
          </UserContext.Provider>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}

export default App;
