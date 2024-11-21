import { Box, Button, Group } from "@mantine/core";
import { IconUserCircle } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import classes from "./HeaderMegaMenu.module.css";
import { allowedUUIDs } from "../constants";

const Navbar = () => {
  const { currentUser } = useContext(UserContext);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      setIsAllowed(allowedUUIDs.includes(currentUser.uid));
    } else {
      setIsAllowed(true);
    }
  }, [currentUser]);

  if (!isAllowed) {
    return null;
  }

  return (
    <Box>
      <header
        className={classes.header}
        style={{
          height: "70px",
          background: currentUser
            ? "linear-gradient(to right, #2FAED7 0%, #0280C7 100%)"
            : "",
        }}
      >
        <Group justify="space-between" h="100%">
          <Link to={currentUser ? "/studyspot" : "/"}>
            {currentUser ? (
              <img src="../../logo/logo-with-text-nav.png" width="250px" />
            ) : (
              <img src="../../logo/logo-no-text.png" width="60px" />
            )}
          </Link>

          <Group visibleFrom="sm">
            {currentUser ? (
              <Link to="/profile">
                <IconUserCircle
                  color="white"
                  stroke={1.75}
                  width="50px"
                  height="50px"
                />
              </Link>
            ) : (
              <>
                <Link to="/login" state={{ isSignup: false }}>
                  <Button radius="lg" variant="default">
                    Log in
                  </Button>
                </Link>
                <Link to="/login" state={{ isSignup: true }}>
                  <Button
                    variant="gradient"
                    radius="lg"
                    gradient={{ from: "#2faed7", to: "#0280c7", deg: 180 }}
                  >
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </Group>
        </Group>
      </header>
    </Box>
  );
};

export default Navbar;
