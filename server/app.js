//Express initialization
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
require('dotenv').config();

// //Firestore imports
// const { initializeApp, cert } = require('firebase-admin/app');
// const { getFirestore } = require('firebase-admin/firestore');

// const serviceAccount = require('./serviceAccountKey.json');
// initializeApp({
//   credential: cert(serviceAccount),
//   databaseURL: process.env.DB_URL,
// });

// const db = getFirestore();

const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require('firebase/auth');

const {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
} = require('firebase/firestore');

const auth = getAuth();
const db = getFirestore();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/test', (req, res) => {
  res.send('Omar Aly & Omar Abotahoon');
});

// Sample post request to upload data into DB
app.post('/testDB_post', async (req, res) => {
  console.log(req.body);
  // await db.collection('testCollection').add(req.body);

  const testCollectionRef = collection(db, 'testCollection');
  await addDoc(testCollectionRef, req.body);

  res.send({ Message: 'Success', Body: req.body });
});

// Sample get request to get data from a certain document
app.get('/testDB_get', async (req, res) => {
  // const testCollectionRef = db.collection('testCollection').doc('testDoc');
  const testCollectionRef = doc(db, 'testCollection', 'testDoc');
  const docSnap = await getDoc(testCollectionRef);

  console.log(docSnap.data());

  res.send(docSnap.data());
});

// Sample update request to update data in a certain document without overwriting other fields
app.put('/testDB_update', async (req, res) => {
  console.log(req.body);

  const testCollectionRef = doc(db, 'testCollection', 'testDoc');
  await updateDoc(testCollectionRef, req.body);

  // await db.collection('testCollection').doc('testDoc').update(req.body);

  res.send({ Message: 'Success' });
});

// Sample get query to get data from a certain document. Instead of getting the whole doc like the previous function
// This query uses a where clause to filter out data
app.get('/query', async (req, res) => {
  const testCollectionRef = collection(db, 'testCollection');
  const q = await getDocs(query(testCollectionRef, where('age', '==', 26)));

  q.forEach((doc) => {
    console.log(doc.data());
  });

  // res.send(snapshot.data());
  res.send({ Message: 'Success' });
});

// Sign up
app.post('/testAuth_create', async (req, res) => {
  console.log(req.body);

  createUserWithEmailAndPassword(auth, req.body.email, req.body.password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      // ..
    });

  res.send({ Message: 'Success', Body: req.body });
});

// Sign in
app.post('/testAuth_login', async (req, res) => {
  console.log(req.body);

  signInWithEmailAndPassword(auth, req.body.email, req.body.password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });

  res.send({ Message: 'Success', Body: req.body });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
