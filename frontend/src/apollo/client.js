import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Use environment variable or default to relative URL in production, localhost in development
const getGraphQLUri = () => {
  if (process.env.REACT_APP_GRAPHQL_URI) {
    return process.env.REACT_APP_GRAPHQL_URI;
  }
  
  // Check if running on localhost
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.includes('192.168.');
  
  if (isLocalhost) {
    // In local development, use localhost backend
    return 'http://localhost:5001/graphql';
  }
  
  // In production (deployed on Vercel), use relative URL
  return '/api/graphql';
};

const httpLink = createHttpLink({
  uri: getGraphQLUri(),
  credentials: 'same-origin',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

// Log the GraphQL URI for debugging
console.log('GraphQL URI:', getGraphQLUri());

export default client;
