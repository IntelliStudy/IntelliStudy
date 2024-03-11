import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

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
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
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

export const googleLoginHandler = (onSuccess: () => void) => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((userCredential) => {
      const user = userCredential.user;

      setDoc(
        doc(db, 'users', user.uid),
        {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
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
    deleteUser(user)
      .then(() => {
        deleteDoc(doc(db, 'users', user.uid));
        console.log(`User ${user.uid} deleted`);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }
};

export const userLogoutHandler = () => {
  const user = auth.currentUser;

  if (user) {
    signOut(auth)
      .then(() => {
        console.log(`User ${user.uid} signed out`);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }
};
