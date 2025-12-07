const Comment = require('../models/Comment');
const Post = require('../models/Post');
const trendingService = require('../services/trendingService');

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = new Comment({
      post: postId,
      user: req.user.id,
      content,
    });

    await comment.save();

    // Push comment reference into Post.comments
    post.comments.push(comment._id);
    await post.save();

     // Update trending rating for the player linked to this post
    await trendingService.addCommentImpact(post.player);

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get comments for a post
exports.getCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.postId;

    const comments = await Comment.find({ post: postId })
      .populate('user', 'username profilePicture teamSupported')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();

    // Remove from Post.comments array
    const post = await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
    });

     // Decrement trending rating for the player linked to this post
    if (post) {
      await trendingService.removeCommentImpact(post.player);
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};