import { Box, Button, Group } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import { allowedUUIDs } from "../../constants";
import classes from "../HeaderMegaMenu.module.css";
import ProfileDropdown from "./ProfileDropdown";

import logoNoText from "../../../logo/logo-no-text.png";
import logoWithText from "../../../logo/logo-with-text-nav.png";

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
              <img src={logoWithText} width="250px" />
            ) : (
              <img src={logoNoText} width="60px" />
            )}
          </Link>

          <Group visibleFrom="sm">
            {currentUser ? (
              <ProfileDropdown />
            ) : (
              <>
                <Link to="/login" state={{ isSignup: false }}>
                  <Button radius="md" variant="default">
                    Log in
                  </Button>
                </Link>
                <Link to="/login" state={{ isSignup: true }}>
                  <Button
                    variant="gradient"
                    radius="md"
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
