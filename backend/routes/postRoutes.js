const express = require('express');
const router = express.Router();
const { createPost, getPosts, getPostById, editPost, deletePost } = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Multer setup

router.post('/', authMiddleware, upload.single('image'), createPost); // Create post (with optional image upload)
router.get('/', getPosts); // Get all posts (filter by ?week=14)
router.get('/:id', getPostById); // Get single post
router.put('/:id', authMiddleware, editPost); // Edit your own post
router.delete('/:id', authMiddleware, deletePost); // Delete post

module.exports = router;