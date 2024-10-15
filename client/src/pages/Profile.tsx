import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import {
  deleteUserHandler,
  getCurrentlySignedInUserHandler,
  userLogoutHandler,
} from "../firebase/auth";

const Profile = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  // Used for deleting account
  const handleAccountDelete = () => {
    console.log("Deleting user account:", currentUser?.displayName);

    deleteUserHandler().then(() => {
      const signedInUser = getCurrentlySignedInUserHandler();
      setCurrentUser(signedInUser);
    });
  };

  // Used for logging out
  const handleLogout = () => {
    console.log("Logging out user:", currentUser?.displayName);

    userLogoutHandler().then(() => {
      const signedInUser = getCurrentlySignedInUserHandler();
      setCurrentUser(signedInUser);
    });
  };

  return (
    <>
      <h1>Profile</h1>
      <div>
        <Link to={"/"}>
          <div>
            <button onClick={handleAccountDelete}>Delete account</button>
          </div>
          <div>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </Link>
        <Link to={"/studyspot"}>
          <button>Back to Study Spot</button>
        </Link>
      </div>
    </>
  );
};

export default Profile;
