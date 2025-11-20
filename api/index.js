// Vercel serverless function entry point
require('dotenv').config();
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
    console.log('Using existing MongoDB connection');
    return;
  }
  try {
    await connectDB();
    isConnected = true;
    console.log('New MongoDB connection established');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
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
    timestamp: new Date().toISOString()
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
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    
    // Initialize Apollo Server if not already done
    await startApolloServer();
    
    // Let Express handle the request
    return app(req, res);
  } catch (error) {
    console.error('Error handling request:', error);
    console.error('Stack trace:', error.stack);
    
    // Set CORS headers even on error
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message,
      path: req.url
    });
  }
};
