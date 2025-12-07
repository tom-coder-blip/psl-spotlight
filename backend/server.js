const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
//load cron jobs
require('./cronJobs');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // parse JSON bodies
app.use(cors());         // allow cross-origin requests

// Import DB connection
const connectDB = require('./config/db');
connectDB();

// Basic route (health check)
app.get('/', (req, res) => {
  res.send('PSL Spotlight Backend is running ⚽🔥');
});


// Routes (we’ll add controllers later)
app.use('/auth', require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/posts', require('./routes/postRoutes'));
app.use('/comments', require('./routes/commentRoutes'));
app.use('/likes', require('./routes/likeRoutes'));
app.use('/players', require('./routes/playerRoutes'));

// Error handling middleware (basic)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));