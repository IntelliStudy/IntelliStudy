const {
  getUserQuery,
  getUserByAgeQuery,
} = require('../../firebase/database/queries/userQueries');

// Controller function Test
async function getTest(req, res) {
  try {
    res.status(200).json('This is a test');
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Controller function to get a user by doc ID
async function getUserByDocId(req, res) {
  try {
    const docId = req.params.docId;
    const user = await getUserQuery(docId);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Doc not found' });
  }
}

// Controller function to get a user by ID
async function getUserByAge(req, res) {
  try {
    const age = parseInt(req.params.age);
    const users = await getUserByAgeQuery(age);

    const userData = [];
    users.forEach((doc) => {
      userData.push(doc.data());
    });

    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ error: 'User not found' });
  }
}

// // Controller function to get a user by ID
// async function getUser(req, res) {
//   try {
//     // // Call userService to fetch user data
//     const user = await getUserQuery();

//     // Send response with user data
//     res.status(200).json(user);
//   } catch (error) {
//     // Handle errors
//     console.error('Error fetching user:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }

module.exports = {
  getTest,
  getUserByDocId,
  getUserByAge,
};
