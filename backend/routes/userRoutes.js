const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // for profile picture

router.get('/:id', getUserProfile); // Get user profile by ID
router.put('/me', authMiddleware, upload.single('profilePicture'), updateUserProfile);// Update own profile
router.post('/:id/follow', authMiddleware, followUser); // Follow a user
router.post('/:id/unfollow', authMiddleware, unfollowUser); // Unfollow a user

module.exports = router;