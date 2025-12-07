const express = require('express');
const router = express.Router();
const { register, login, logout, deleteAccount } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register); // Register
router.post('/login', login); // Login
router.post('/logout', authMiddleware, logout); // Logout
router.delete('/delete', authMiddleware, deleteAccount); // Delete account

module.exports = router;