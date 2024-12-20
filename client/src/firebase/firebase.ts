import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBPB07w8s59XPV-xrA206gGbuNw79n7PbA",
  authDomain: "intellistudy-capstone.firebaseapp.com",
  projectId: "intellistudy-capstone",
  storageBucket: "intellistudy-capstone.appspot.com",
  messagingSenderId: "1042357477540",
  appId: "1:1042357477540:web:ca8fff87c004f09b7e0631",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// // Used to enable emulator for dev
// connectFirestoreEmulator(db, "127.0.0.1", 8080);
// connectAuthEmulator(auth, "http://127.0.0.1:9099");
// connectStorageEmulator(storage, "127.0.01", 9199);
