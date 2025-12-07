const express = require('express');
const router = express.Router();
const {
  createPlayer,
  getPlayers,
  getPlayerById,
  updatePlayerStats,
} = require('../controllers/playerController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // for player picture

router.post('/', authMiddleware, upload.single('playerPicture'), createPlayer); // Create player (admin only, for now just protected)
router.get('/', getPlayers); // Get all players
router.get('/:id', getPlayerById); // Get single player + posts about them
router.put('/:id', authMiddleware, upload.single('playerPicture'), updatePlayerStats); // Update player info (admin only)

module.exports = router;