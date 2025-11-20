// Debug endpoint to check environment variables
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    message: 'Environment Variables Check',
    variables: {
      MONGODB_URI: process.env.MONGODB_URI ? 'SET (hidden)' : 'NOT SET ❌',
      VISUAL_CROSSING_API_KEY: process.env.VISUAL_CROSSING_API_KEY ? 'SET ✅' : 'NOT SET ❌',
      YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY ? 'SET ✅' : 'NOT SET ❌',
      NEWS_API_KEY: process.env.NEWS_API_KEY ? 'SET ✅' : 'NOT SET ❌',
      UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY ? 'SET ✅' : 'NOT SET ❌',
      NODE_ENV: process.env.NODE_ENV || 'NOT SET ❌',
      RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS || 'NOT SET (optional)',
      RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS || 'NOT SET (optional)',
    },
    timestamp: new Date().toISOString(),
  });
};
