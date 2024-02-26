const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require('firebase/auth');

const firebaseApp = require('../../firebase/firebase');
const auth = getAuth();

// Controller function to register account though firebase
async function emailRegister(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    await createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(user);
      }
    );

    // Send response
    res.status(200).json({ Message: 'Success', Body: req.body });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
}

// Controller function to login account though firebase
async function emailSignIn(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    await signInWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
      }
    );

    // Send response
    res.status(200).json({ Message: 'Success', Body: req.body });
  } catch (error) {
    res.status(500).json({ error: 'Error signing in' });
  }
}

module.exports = {
  emailRegister,
  emailSignIn,
};
