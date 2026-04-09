const express = require('express');
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/login', userController.login);
router.post('/register', userController.register);

// Protected routes
router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, userController.updateProfile);

module.exports = router;
