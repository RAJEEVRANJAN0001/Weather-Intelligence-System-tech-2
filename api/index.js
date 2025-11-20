// Vercel serverless function entry point
const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('../backend/config/database');
const typeDefs = require('../backend/graphql/typeDefs');
const resolvers = require('../backend/graphql/resolvers');
const exportRouter = require('../backend/routes/export');

// Initialize Express app
const app = express();

// Connect to MongoDB (with connection pooling for serverless)
let isConnected = false;

async function connectToDatabase() {
  if (isConnected) {
    console.log('♻️ Using existing MongoDB connection');
    return;
  }
  
  try {
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    console.log('🔌 Connecting to MongoDB...');
    await connectDB();
    isConnected = true;
    console.log('✅ MongoDB connection established');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    // Log more details for debugging
    console.error('Environment check:', {
      hasMongoUri: !!process.env.MONGODB_URI,
      nodeEnv: process.env.NODE_ENV
    });
    throw error;
  }
}

// Handle OPTIONS requests for CORS preflight
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).send();
});

// CORS configuration
app.use(cors({
  origin: true, // Allow all origins in production, you can restrict this later
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REST Routes
app.use('/api/export', exportRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Weather Intelligence API is running',
    timestamp: new Date().toISOString(),
    environment: {
      hasMongoUri: !!process.env.MONGODB_URI,
      hasVisualCrossingKey: !!process.env.VISUAL_CROSSING_API_KEY,
      hasYoutubeKey: !!process.env.YOUTUBE_API_KEY,
      hasNewsKey: !!process.env.NEWS_API_KEY,
      hasUnsplashKey: !!process.env.UNSPLASH_ACCESS_KEY,
      nodeEnv: process.env.NODE_ENV
    }
  });
});

// Debug endpoint (remove after fixing)
app.get('/debug', (req, res) => {
  res.json({
    message: 'Environment Variables Check',
    variables: {
      MONGODB_URI: process.env.MONGODB_URI ? 'SET (hidden)' : 'NOT SET',
      VISUAL_CROSSING_API_KEY: process.env.VISUAL_CROSSING_API_KEY ? 'SET' : 'NOT SET',
      YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY ? 'SET' : 'NOT SET',
      NEWS_API_KEY: process.env.NEWS_API_KEY ? 'SET' : 'NOT SET',
      UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT SET'
    }
  });
});

// Apollo Server setup (cached)
let apolloServer = null;

async function startApolloServer() {
  if (apolloServer) {
    return apolloServer;
  }

  await connectToDatabase();

  apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return { req };
    },
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return {
        message: error.message,
        code: error.extensions?.code,
        path: error.path
      };
    },
    introspection: true,
    playground: true,
    cache: 'bounded'
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ 
    app, 
    path: '/graphql',
    cors: false // We're handling CORS above
  });
  
  console.log('Apollo Server started');
  return apolloServer;
}

// Main request handler
module.exports = async (req, res) => {
  try {
    console.log(`📨 [${new Date().toISOString()}] ${req.method} ${req.url}`);
    
    // Special handling for health and debug routes (don't need Apollo)
    if (req.url === '/health' || req.url === '/debug' || req.url.startsWith('/api/export')) {
      return app(req, res);
    }
    
    // Initialize Apollo Server for GraphQL requests
    console.log('🚀 Initializing Apollo Server...');
    await startApolloServer();
    console.log('✅ Apollo Server ready');
    
    // Let Express handle the request
    return app(req, res);
  } catch (error) {
    console.error('❌ Error handling request:', error);
    console.error('Stack trace:', error.stack);
    
    // Check if it's an environment variable issue
    if (error.message.includes('MONGODB_URI')) {
      console.error('🚨 CRITICAL: MongoDB environment variable not set!');
      console.error('Please add MONGODB_URI to Vercel environment variables');
    }
    
    // Set CORS headers even on error
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message,
      hint: error.message.includes('MONGODB_URI') 
        ? 'Environment variables not configured in Vercel. Please add them in Settings > Environment Variables'
        : 'Check Vercel function logs for details',
      path: req.url,
      timestamp: new Date().toISOString()
    });
  }
};
