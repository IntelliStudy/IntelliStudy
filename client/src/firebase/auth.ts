import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
<<<<<<< HEAD
<<<<<<< HEAD
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
=======
import { deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
>>>>>>> bbd689a (WIP: Generate Quiz button in database)
=======
import { deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
>>>>>>> 66802f34fde0b6040036e7f21f349bff5c9b2f6d
import { auth, db } from './firebase';

// Function used to retreive user status (signed in or not)
export const getCurrentlySignedInUserHandler = () => {
  const user = auth.currentUser;

  if (user) {
    return user;
  } else {
    console.log('No user currently signed in');
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
    .then((userCredential) => {
      const user = userCredential.user;

      // Calls a DB call to create a record for the user who just signed up
      setDoc(
        doc(db, 'users', user.uid),
        {
          uid: user.uid,
          fName: fName,
          lName: lName,
          displayName: `${fName} ${lName}`,
          email: email,
          password: password,
          signedIn: true,
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
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
};

// Function used to call the Firebase login function
export const loginHandler = (
  email: string,
  password: string,
  onSuccess: () => void
) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Calls the DB to update user signedIn status in DB
      setDoc(
        doc(db, 'users', user.uid),
        {
          signedIn: true,
        },
        { merge: true }
      );
    })
    .then(() => {
      onSuccess();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
};

// Function used to call the Firebase Google authentication function (Used for both signups and logins)
export const googleLoginHandler = (onSuccess: () => void) => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider)
    .then(async (userCredential) => {
      const user = userCredential.user;

      // Check if the user exists in the database
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      // Determine the boolean value of uploadedFiles based on user existence
      const uploadedFiles = userDoc.exists()
        ? userDoc.data().uploadedFiles
        : false;

      userDoc.exists()
        ? // Case for handling if user already exists and user is just signing in using google auth
          setDoc(
            doc(db, 'users', user.uid),
            {
              signedIn: true,
            },
            { merge: true }
          )
        : // Case for handling if user doesn't exists and user is signing up with google auth
          setDoc(
            doc(db, 'users', user.uid),
            {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              signedIn: true,
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
    });
};

// Function used to call the Firebase delete user function
export const deleteUserHandler = () => {
  const user = auth.currentUser;

  if (user) {
    return deleteUser(user)
      .then(() => {
        // Delete DB record of user
        deleteDoc(doc(db, 'users', user.uid));
        console.log(`User ${user.uid} deleted`);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  } else {
    return Promise.resolve();
  }
};

// Function used to call the Firebase logout function
export const userLogoutHandler = () => {
  const user = auth.currentUser;

  if (user) {
    return signOut(auth)
      .then(() => {
        console.log(`User ${user.uid} signed out`);

<<<<<<< HEAD
<<<<<<< HEAD
        // Updating DB record to indicate that user is signed out
        setDoc(
          doc(db, 'users', user.uid),
          {
            signedIn: false,
          },
          { merge: true }
        );
=======
=======
>>>>>>> 66802f34fde0b6040036e7f21f349bff5c9b2f6d
        updateDoc(doc(db, 'users', user.uid), {
          signedIn: false
        });
>>>>>>> bbd689a (WIP: Generate Quiz button in database)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  } else {
    return Promise.resolve();
  }
};
