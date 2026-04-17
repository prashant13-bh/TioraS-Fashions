
import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (pb.authStore.isValid && pb.authStore.model?.role === 'admin') {
        setCurrentAdmin(pb.authStore.model);
      } else {
        setCurrentAdmin(null);
      }
      setIsLoading(false);
    };

    checkAuth();

    const unsubscribe = pb.authStore.onChange(() => {
      checkAuth();
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      if (authData.record.role !== 'admin') {
        pb.authStore.clear();
        throw new Error('Unauthorized: Admin access required.');
      }
      setCurrentAdmin(authData.record);
      return authData;
    } catch (error) {
      pb.authStore.clear();
      throw error;
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentAdmin(null);
  };

  const value = {
    currentAdmin,
    isAuthenticated: !!currentAdmin,
    isLoading,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {!isLoading && children}
    </AdminAuthContext.Provider>
  );
};
