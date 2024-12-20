import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// Function used to retreive user status (signed in or not)
export const getCurrentlySignedInUserHandler = () => {
  const user = auth.currentUser;

  if (user) {
    return user;
  } else {
    console.log("No user currently signed in");
  }
};

// Function used to call the Firebase Signup function
export const signUpHandler = (
  email: string,
  password: string,
  fName: string,
  lName: string,
  onSuccess: () => void
) => {
  return createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;

      // Calls a DB call to create a record for the user who just signed up
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          fName: fName,
          lName: lName,
          displayName: `${fName} ${lName}`,
          email: email,
          password: password,
          uploadedFiles: false,
        },
        { merge: true }
      );
      return user;
    })
    .then(() => {
      onSuccess();
    })
    .catch((error) => {
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // console.log(errorCode, errorMessage);
      throw error;
    });
};

// Function used to call the Firebase login function
export const loginHandler = (
  email: string,
  password: string,
  onSuccess: () => void
) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      onSuccess();
    })
    .catch((error) => {
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // console.log(errorCode, errorMessage);
      throw error;
    });
};

// Function used to call the Firebase Google authentication function (Used for both signups and logins)
export const googleLoginHandler = (onSuccess: () => void) => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider)
    .then(async (userCredential) => {
      const user = userCredential.user;

      // Check if the user exists in the database
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      // Determine the boolean value of uploadedFiles based on user existence
      const uploadedFiles = userDoc.exists()
        ? userDoc.data().uploadedFiles
        : false;

      userDoc.exists();
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          uploadedFiles: uploadedFiles,
        },
        { merge: true }
      );

      return user;
    })
    .then(() => {
      onSuccess();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      throw error;
    });
};

// Function used to call the Firebase delete user function
export const deleteUserHandler = () => {
  const user = auth.currentUser;

  if (user) {
    return deleteDoc(doc(db, "users", user.uid))
      .then(() => {
        return deleteUser(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Error deleting user: ${errorCode} - ${errorMessage}`);
        throw error;
      });
  } else {
    return Promise.resolve();
  }
};

// Function used to call the Firebase logout function
export const userLogoutHandler = () => {
  const user = auth.currentUser;

  if (user) {
    return signOut(auth).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
  } else {
    return Promise.resolve();
  }
};
