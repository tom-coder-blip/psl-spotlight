const Player = require('../models/Player');
const Post = require('../models/Post');

// Create a new player (with optional picture)
exports.createPlayer = async (req, res) => {
  try {
    const { name, club, position } = req.body;

    const player = new Player({
      name,
      club,
      position,
      playerPicture: req.file ? req.file.path : '', // Multer handles file upload
    });

    await player.save();
    res.status(201).json(player);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all players
exports.getPlayers = async (req, res) => {
  try {
    const players = await Player.find().sort({ name: 1 });
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get player by ID (with posts about them)
exports.getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: 'Player not found' });

    const posts = await Post.find({ playerName: player.name })
      .populate('user', 'username profilePicture teamSupported')
      .sort({ createdAt: -1 });

    res.json({ player, posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update player stats (optional, admin use)
exports.updatePlayerStats = async (req, res) => {
  try {
    const { goals, assists, appearances, trendingRating } = req.body;

    const player = await Player.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          'stats.goals': goals,
          'stats.assists': assists,
          'stats.appearances': appearances,
          trendingRating,
          playerPicture: req.file ? req.file.path : undefined,
        },
      },
      { new: true }
    );

    if (!player) return res.status(404).json({ message: 'Player not found' });

    res.json(player);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};