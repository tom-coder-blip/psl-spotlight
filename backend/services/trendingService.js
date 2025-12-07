const Player = require('../models/Player');

exports.addPostImpact = async (playerId) => {
  await Player.updateOne(
    { _id: playerId },
    { $inc: { trendingRating: 10 } }
  );
};

exports.removePostImpact = async (playerId) => {
  await Player.updateOne(
    { _id: playerId },
    { $inc: { trendingRating: -10 } }
  );
};

exports.addCommentImpact = async (playerId) => {
  await Player.updateOne(
    { _id: playerId },
    { $inc: { trendingRating: 4 } } // weight for comment
  );
};

exports.removeCommentImpact = async (playerId) => {
  await Player.updateOne(
    { _id: playerId },
    { $inc: { trendingRating: -4 } }
  );
};

exports.addLikeImpact = async (playerId) => {
  await Player.updateOne(
    { _id: playerId },
    { $inc: { trendingRating: 2 } } // weight for like
  );
};

exports.removeLikeImpact = async (playerId) => {
  await Player.updateOne(
    { _id: playerId },
    { $inc: { trendingRating: -2 } }
  );
};

// Nightly decay: reduce trendingRating by 10%
exports.applyDecay = async () => {
  try {
    await Player.updateMany(
      {},
      { $mul: { trendingRating: 0.95 } } // multiply by 0.95 (reduce by 5%)
    );
    console.log('Trending ratings decayed successfully');
  } catch (error) {
    console.error('Error applying decay:', error.message);
  }
};
