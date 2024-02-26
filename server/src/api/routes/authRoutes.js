const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/authController');

// Routes
router.post('/emailRegister', authController.emailRegister);
router.post('/emailSignIn', authController.emailSignIn);

module.exports = router;
