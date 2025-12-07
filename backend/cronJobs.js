const cron = require('node-cron');
const trendingService = require('./services/trendingService');

// Run every night at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running nightly trending decay...');
  await trendingService.applyDecay();
});