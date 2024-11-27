import { Avatar, Menu, Text } from "@mantine/core";
import {
  IconLogout2,
  IconTrashFilled,
  IconUserCircle,
} from "@tabler/icons-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import {
  deleteUserHandler,
  getCurrentlySignedInUserHandler,
  userLogoutHandler,
} from "../../firebase/auth";
import { ConfirmDelete } from "../ConfirmDelete";

const ProfileDropdown = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const navigate = useNavigate();

  // Used for deleting account
  const handleAccountDelete = () => {
    deleteUserHandler()
      .then(() => navigate("/"))
      .then(() => {
        const signedInUser = getCurrentlySignedInUserHandler();
        setCurrentUser(signedInUser);
      });
  };

  // Used for logging out
  const handleLogout = () => {
    userLogoutHandler()
      .then(() => navigate("/"))
      .then(() => {
        const signedInUser = getCurrentlySignedInUserHandler();
        setCurrentUser(signedInUser);
      });
  };

  return (
    <Menu>
      <Menu.Target>
        {currentUser.photoURL ? (
          <Avatar
            src={currentUser.photoURL}
            w="40px"
            h="40px"
            style={{
              cursor: "pointer",
              marginRight: "30px",
            }}
          />
        ) : (
          <IconUserCircle
            color="white"
            stroke={1.75}
            width="50px"
            height="50px"
            style={{
              cursor: "pointer",
              marginRight: "30px",
            }}
          />
        )}
      </Menu.Target>

      <Menu.Dropdown w="190px" mt="8px">
        <Menu.Item
          leftSection={<IconLogout2 stroke={2} />}
          style={{ textAlign: "center" }}
          onClick={handleLogout}
        >
          <Text fz="15px" fw="500">
            Logout
          </Text>
        </Menu.Item>
        <Menu.Item
          leftSection={<IconTrashFilled />}
          color="red"
          style={{ textAlign: "center" }}
          onClick={() =>
            ConfirmDelete(
              "Delete Account",
              "Are you sure you want to delete this account? This action cannot be undone.",
              "Cancel",
              "Delete Account",
              () => handleAccountDelete()
            )
          }
        >
          <Text fz="15px" fw="500">
            Delete Account
          </Text>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ProfileDropdown;
