//Express initialization
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

//Firestore imports
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require('./serviceAccountKey.json');
initializeApp({
  credential: cert(serviceAccount),
  databaseURL: process.env.DB_URL,
});

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
  await db.collection('testCollection').add(req.body);

  res.send({ Message: 'Success',
            Body: req.body});
});

// Sample get request to get data from a certain document
app.get('/testDB_get', async (req, res) => {
  const testCollectionRef = db.collection('testCollection').doc('testDoc');
  const doc = await testCollectionRef.get();

  console.log(doc.data());

  res.send(doc.data());
});

// Sample update request to update data in a certain document without overwriting other fields
app.put('/testDB_update', async (req, res) => {
  console.log(req.body);
  await db.collection('testCollection').doc('testDoc').update(req.body);

  res.send({ Message: 'Success' });
});

// Sample get query to get data from a certain document. Instead of getting the whole doc like the previous function
// This query uses a where clause to filter out data
app.get('/query', async (req, res) => {
  const testCollectionRef = db.collection('testCollection');
  const snapshot = await testCollectionRef.where('age', '==', 30).get();

  snapshot.forEach((doc) => {
    console.log(doc.data());
  });

  // res.send(snapshot.data());
  res.send({ Message: 'Success' });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
