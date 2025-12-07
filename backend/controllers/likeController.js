const Like = require('../models/Like');
const Post = require('../models/Post');
const trendingService = require('../services/trendingService');

// Like a post
exports.likePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Check if already liked
    const existingLike = await Like.findOne({ post: postId, user: req.user.id });
    if (existingLike) return res.status(400).json({ message: 'Already liked this post' });

    const like = new Like({ post: postId, user: req.user.id });
    await like.save();

    // Add user to Post.likes array
    const post = await Post.findByIdAndUpdate(postId, { $addToSet: { likes: req.user.id } });

     // Update trending rating for the player linked to this post
    if (post) {
      await trendingService.addLikeImpact(post.player);
    }

    res.status(201).json({ message: 'Post liked', like });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    const like = await Like.findOneAndDelete({ post: postId, user: req.user.id });
    if (!like) return res.status(404).json({ message: 'Like not found' });

     // Remove user from Post.likes array
    const post = await Post.findByIdAndUpdate(postId, { $pull: { likes: req.user.id } });

    // Decrement trending rating for the player linked to this post
    if (post) {
      await trendingService.removeLikeImpact(post.player);
    }

    res.json({ message: 'Post unliked' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get likes for a post
exports.getLikesByPost = async (req, res) => {
  try {
    const postId = req.params.postId;

    const likes = await Like.find({ post: postId })
      .populate('user', 'username profilePicture teamSupported');

    res.json(likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};