const express = require('express');
const router = express.Router();
const { likePost, unlikePost, getLikesByPost } = require('../controllers/likeController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:postId', authMiddleware, likePost); // Like a post
router.delete('/:postId', authMiddleware, unlikePost); // Unlike a post
router.get('/:postId', getLikesByPost); // Get all likes for a post

module.exports = router;