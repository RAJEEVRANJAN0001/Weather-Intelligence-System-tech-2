// Health check endpoint
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
    status: 'OK',
    message: 'Weather Intelligence API is running',
    timestamp: new Date().toISOString(),
    environment: {
      hasMongoUri: !!process.env.MONGODB_URI,
      hasVisualCrossingKey: !!process.env.VISUAL_CROSSING_API_KEY,
      hasYoutubeKey: !!process.env.YOUTUBE_API_KEY,
      hasNewsKey: !!process.env.NEWS_API_KEY,
      hasUnsplashKey: !!process.env.UNSPLASH_ACCESS_KEY,
      nodeEnv: process.env.NODE_ENV,
    },
  });
};
