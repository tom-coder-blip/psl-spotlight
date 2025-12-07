const Post = require('../models/Post');
const trendingService = require('../services/trendingService');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { player, playerName, club, matchweek, title, content, tags } = req.body;

    const post = new Post({
      user: req.user.id, // from JWT middleware
      player,
      playerName,
      club,
      matchweek,
      title,
      content,
      tags,
      image: req.file ? req.file.path : '', // if using Multer for uploads
    });

    await post.save();
    await trendingService.addPostImpact(player);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all posts (optionally filter by matchweek)
exports.getPosts = async (req, res) => {
  try {
    const { week } = req.query;
    const filter = week ? { matchweek: week } : {};

    const posts = await Post.find(filter)
      .populate('user', 'username teamSupported profilePicture')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username teamSupported profilePicture')
      .populate('comments');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update post
exports.editPost = async (req, res) => {
  try {
    // First, find the post to check ownership
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { playerName, club, matchweek, title, content, tags } = req.body;

    // Use findByIdAndUpdate with $set for cleaner updates
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          playerName: playerName ?? post.playerName,
          club: club ?? post.club,
          matchweek: matchweek ?? post.matchweek,
          title: title ?? post.title,
          content: content ?? post.content,
          tags: tags ?? post.tags,
          image: req.file ? req.file.path : post.image,
        },
      },
      { new: true } // return the updated document
    );

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await trendingService.removePostImpact(post.player);
    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


