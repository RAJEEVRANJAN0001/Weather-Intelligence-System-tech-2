import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import client from './apollo/client';
import { UserProvider } from './context/UserContext';
import Home from './pages/Home';
import './index.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </UserProvider>
    </ApolloProvider>
  );
}

export default App;
