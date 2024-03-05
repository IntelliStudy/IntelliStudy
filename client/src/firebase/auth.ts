import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { db } from "./firebase";
import { setDoc, addDoc, doc, collection } from "firebase/firestore";

export const signUp = (
  email: string,
  password: string,
  fName: string,
  lName: string
) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          fName: fName,
          lName: lName,
          email: email,
          password: password,
        },
        { merge: true }
      );
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
};

export const login = (email: string, password: string) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
};
