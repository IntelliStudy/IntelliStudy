import { Button, Flex, Image, List, Text } from "@mantine/core";
import { IconUserCircle } from "@tabler/icons-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";

const Navbar = () => {
  const { currentUser } = useContext(UserContext);

  return (
    <>
      <nav className="w-full flex justify-between items-center px-4 h-[80px] bg-gradient-to-r from-navbarDark to-navbarLight">
        <Link to={currentUser ? "/studyspot" : "/"}>
          <Image
            radius="sm"
            w={240}
            ml={"10px"}
            mt={"10px"}
            src="/logo/logo-with-text-nav.png"
          />
        </Link>

        <List type="unordered" listStyleType="none" pr={"2.5rem"}>
          {currentUser && (
            // User logged in
            <Flex direction={"row"} ml={"1rem"}>
              <Link to={"/profile"}>
                <List.Item display={"inline"}>
                  <IconUserCircle
                    color="white"
                    stroke={1.75}
                    width={"50px"}
                    height={"50px"}
                  />
                </List.Item>
              </Link>
            </Flex>
          )}

          {!currentUser && (
            // User not logged in
            <Flex align={"center"}>
              <Link to={"/login"}>
                <List.Item display={"inline"} fz={"22px"} fw={"600"} c="white">
                  Login
                </List.Item>
              </Link>
              <Link to={"/login"}>
                <List.Item>
                  <Button
                    p={0}
                    ml={"1.8rem"}
                    variant="gradient"
                    gradient={{ from: "#FFFFFF", to: "#E0E0E0" }}
                    radius={10}
                    w="110px"
                    h="45px"
                  >
                    <Text fz={"22px"} fw={"600"} c={"black"}>
                      Sign up
                    </Text>
                  </Button>
                </List.Item>
              </Link>
            </Flex>
          )}
        </List>
      </nav>
    </>
  );
};

export default Navbar;
