// import { Button, Flex, Image, List, Text } from "@mantine/core";
// import { IconUserCircle } from "@tabler/icons-react";
// import { useContext } from "react";
// import { Link } from "react-router-dom";
// import { UserContext } from "../App";

// const Navbar = () => {
//   const { currentUser } = useContext(UserContext);

//   return (
//     <>
//       <nav className="w-full flex justify-between items-center px-4 h-[80px] bg-gradient-to-r from-navbarDark to-navbarLight">
//         <Link to={currentUser ? "/studyspot" : "/"}>
//           <Image
//             radius="sm"
//             w={240}
//             ml={"10px"}
//             mt={"10px"}
//             src="/logo/logo-with-text-nav.png"
//           />
//         </Link>

//         <List type="unordered" listStyleType="none" pr={"2.5rem"}>
//           {currentUser && (
//             // User logged in
//             <Flex direction={"row"} ml={"1rem"}>
//               <Link to={"/profile"}>
//                 <List.Item display={"inline"}>
//                   <IconUserCircle
//                     color="white"
//                     stroke={1.75}
//                     width={"50px"}
//                     height={"50px"}
//                   />
//                 </List.Item>
//               </Link>
//             </Flex>
//           )}

//           {!currentUser && (
//             // User not logged in
//             <Flex align={"center"}>
//               <Link to={"/login"}>
//                 <List.Item display={"inline"} fz={"22px"} fw={"600"} c="white">
//                   Login
//                 </List.Item>
//               </Link>
//               <Link to={"/login"} state={{ isSignup: true }}>
//                 <List.Item>
//                   <Button
//                     p={0}
//                     ml={"1.8rem"}
//                     variant="gradient"
//                     gradient={{ from: "#FFFFFF", to: "#E0E0E0" }}
//                     radius={10}
//                     w="110px"
//                     h="45px"
//                   >
//                     <Text fz={"22px"} fw={"600"} c={"black"}>
//                       Sign up
//                     </Text>
//                   </Button>
//                 </List.Item>
//               </Link>
//             </Flex>
//           )}
//         </List>
//       </nav>
//     </>
//   );
// };

// export default Navbar;
import {
  Anchor,
  Box,
  Burger,
  Button,
  Center,
  Collapse,
  Divider,
  Drawer,
  Group,
  HoverCard,
  ScrollArea,
  SimpleGrid,
  Text,
  ThemeIcon,
  UnstyledButton,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconUserCircle } from "@tabler/icons-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import classes from "./HeaderMegaMenu.module.css";

const Navbar = () => {
  const { currentUser } = useContext(UserContext);

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
