
import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(pb.authStore.model);
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setCurrentUser(model);
      setIsAuthenticated(pb.authStore.isValid);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      setCurrentUser(authData.record);
      setIsAuthenticated(true);
      return { success: true, user: authData.record };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (email, password, passwordConfirm, name) => {
    try {
      const data = {
        email,
        password,
        passwordConfirm,
        name,
        role: 'user'
      };
      
      const record = await pb.collection('users').create(data, { $autoCancel: false });
      
      await login(email, password);
      
      return { success: true, user: record };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
