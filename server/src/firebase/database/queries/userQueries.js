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

const firebase = require('../../firebase');
const { getFirestore } = require('firebase/firestore');
const db = getFirestore();

// Queries
async function getUserQuery(docId) {
  const collectionRef = doc(db, 'testCollection', docId);
  const docSnap = await getDoc(collectionRef);

  if (docSnap == undefined) {
    throw undefined;
  }

  return docSnap.data();
}

async function addUserQuery(req) {
  const collectionRef = collection(db, 'testCollection');
  const docSnap = await addDoc(collectionRef, req.body);

  return docSnap;
}

async function updateUserQuery(req) {
  const collectionRef = doc(db, 'testCollection', 'testDoc');
  const docSnap = await updateDoc(collectionRef, req.body);

  return docSnap;
}

async function getUserByAgeQuery(age) {
  const collectionRef = collection(db, 'testCollection');
  const qSnap = await getDocs(query(collectionRef, where('age', '==', age)));

  if (qSnap == undefined) {
    throw undefined;
  }

  qSnap.forEach((doc) => {
    console.log(doc.data());
  });

  return qSnap;
}

module.exports = {
  getUserQuery,
  addUserQuery,
  updateUserQuery,
  getUserByAgeQuery,
};
