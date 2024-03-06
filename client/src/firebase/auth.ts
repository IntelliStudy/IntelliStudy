import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export const signUpHandler = (
  email: string,
  password: string,
  fName: string,
  lName: string
) => {
  createUserWithEmailAndPassword(auth, email, password)
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
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
};

export const loginHandler = (email: string, password: string) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
};

export const googleLoginHandler = () => {
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
