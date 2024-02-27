const express = require('express');
const router = express.Router();

// Controllers
const userController = require('../controllers/userController');

// Routes
router.get('/test', userController.getTest);
router.get('/doc/:docId', userController.getUserByDocId);
router.get('/age/:age', userController.getUserByAge);

module.exports = router;
