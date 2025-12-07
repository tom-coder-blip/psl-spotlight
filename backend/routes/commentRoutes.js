const express = require('express');
const router = express.Router();
const { createComment, getCommentsByPost, deleteComment } = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:postId', authMiddleware, createComment); // Create comment on a post
router.get('/:postId', getCommentsByPost); // Get all comments for a post
router.delete('/:id', authMiddleware, deleteComment); // Delete a comment

module.exports = router;