import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export const getCurrentlySignedInUserHandler = () => {
  const user = auth.currentUser;

  if (user) {
    return user;
  } else {
    console.log('No user currently signed in');
  }
};

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

export const loginHandler = (
  email: string,
  password: string,
  onSuccess: () => void
) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

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

export const googleLoginHandler = (onSuccess: () => void) => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider)
    .then(async (userCredential) => {
      const user = userCredential.user;

      // Check if the user exists in the database
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      // Determine the value of uploadedFiles based on user existence
      const uploadedFiles = userDoc.exists()
        ? userDoc.data().uploadedFiles
        : false;

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

export const deleteUserHandler = () => {
  const user = auth.currentUser;

  if (user) {
    return deleteUser(user)
      .then(() => {
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

export const userLogoutHandler = () => {
  const user = auth.currentUser;

  if (user) {
    return signOut(auth)
      .then(() => {
        console.log(`User ${user.uid} signed out`);

        setDoc(
          doc(db, 'users', user.uid),
          {
            signedIn: false,
          },
          { merge: true }
        );
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
