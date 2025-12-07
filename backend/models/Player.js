const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    playerPicture: {
      type: String, // store image URL or file path
      default: '',
    },
    club: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      default: '',
    },
    stats: {
      goals: { type: Number, default: 0 },
      assists: { type: Number, default: 0 },
      appearances: { type: Number, default: 0 },
    },
    trendingRating: {
      type: Number, // calculated based on likes/comments/posts
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Player', playerSchema);