import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      userId
      email
      name
      created_at
      last_login
    }
  }
`;

const UPDATE_USER_LOGIN = gql`
  mutation UpdateUserLogin($userId: String!) {
    updateUserLogin(userId: $userId) {
      id
      userId
      last_login
    }
  }
`;

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [createUserMutation] = useMutation(CREATE_USER);
  const [updateUserLoginMutation] = useMutation(UPDATE_USER_LOGIN);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedEmail = localStorage.getItem('userEmail');
    const storedName = localStorage.getItem('userName');

    if (storedUserId) {
      setCurrentUser({
        userId: storedUserId,
        email: storedEmail,
        name: storedName
      });

      // Update last login
      updateUserLoginMutation({ 
        variables: { userId: storedUserId } 
      }).catch(err => console.error('Failed to update login:', err));
    }

    setIsLoading(false);
  }, [updateUserLoginMutation]);

  const login = async (userId, email, name) => {
    try {
      // Try to update login (user exists)
      const { data } = await updateUserLoginMutation({ 
        variables: { userId } 
      });

      const user = { userId, email, name };
      setCurrentUser(user);
      localStorage.setItem('userId', userId);
      if (email) localStorage.setItem('userEmail', email);
      if (name) localStorage.setItem('userName', name);

      return { success: true, user };
    } catch (error) {
      // If user doesn't exist, create new user
      if (error.message.includes('User not found')) {
        try {
          const { data } = await createUserMutation({
            variables: {
              input: { userId, email, name }
            }
          });

          const user = data.createUser;
          setCurrentUser({
            userId: user.userId,
            email: user.email,
            name: user.name
          });

          localStorage.setItem('userId', user.userId);
          if (user.email) localStorage.setItem('userEmail', user.email);
          if (user.name) localStorage.setItem('userName', user.name);

          return { success: true, user, isNewUser: true };
        } catch (createError) {
          return { success: false, error: createError.message };
        }
      }

      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
  };

  const value = {
    currentUser,
    isLoading,
    login,
    logout,
    isAuthenticated: !!currentUser
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
