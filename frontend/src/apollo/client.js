import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Use environment variable or default to relative URL in production, localhost in development
const getGraphQLUri = () => {
  if (process.env.REACT_APP_GRAPHQL_URI) {
    return process.env.REACT_APP_GRAPHQL_URI;
  }
  // In production (deployed), use relative URL
  if (process.env.NODE_ENV === 'production') {
    return '/api/graphql';
  }
  // In development, use localhost
  return 'http://localhost:5001/graphql';
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
