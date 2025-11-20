// GraphQL serverless function
const { ApolloServer } = require('apollo-server-micro');
const connectDB = require('../backend/config/database');
const typeDefs = require('../backend/graphql/typeDefs');
const resolvers = require('../backend/graphql/resolvers');

// Global Apollo Server instance
let apolloServer;

async function getApolloServer() {
  if (!apolloServer) {
    await connectDB();
    
    apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({ req }),
      introspection: true,
      playground: true,
    });

    await apolloServer.start();
  }
  return apolloServer;
}

// Vercel serverless function handler
const handler = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, apollo-require-preflight');

  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('GraphQL request received:', req.method, req.url);
    
    // Check environment variables
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not configured');
    }
    
    const server = await getApolloServer();
    return server.createHandler({ path: '/api/graphql' })(req, res);
  } catch (error) {
    console.error('GraphQL Error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      error: error.message,
      hint: 'Check Vercel function logs for details'
    });
  }
};

// Tell Vercel this is a serverless function with custom config
handler.config = {
  api: {
    bodyParser: false,
  },
};

module.exports = handler;
