// Vercel serverless function entry point
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('../backend/config/database');
const typeDefs = require('../backend/graphql/typeDefs');
const resolvers = require('../backend/graphql/resolvers');
const exportRouter = require('../backend/routes/export');
const rateLimit = require('express-rate-limit');

const app = express();

// Connect to MongoDB (with connection pooling for serverless)
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  cachedDb = await connectDB();
  return cachedDb;
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// REST Routes
app.use('/api/export', exportRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Weather Intelligence API is running' });
});

// Apollo Server setup
let apolloServerHandler = null;

async function getApolloServerHandler() {
  if (apolloServerHandler) {
    return apolloServerHandler;
  }

  await connectToDatabase();

  const server = new ApolloServer({
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
    playground: true
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
  
  apolloServerHandler = app;
  return apolloServerHandler;
}

// Export handler for Vercel
module.exports = async (req, res) => {
  const handler = await getApolloServerHandler();
  return handler(req, res);
};
