/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, userService } from '../services/firebaseServices';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? firebaseUser.email : 'No user');
      setUser(firebaseUser);
      
      if (firebaseUser) {
        userService.ensureUserProfile(firebaseUser);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email, password) => {
    setLoading(true);
    try {
      const result = await authService.register(email, password);
      console.log('✅ Registration successful');
      return result;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      console.log('✅ Login successful');
      return result;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = () => {
    return user?.email === 'admin@fpmoz.sum.ba';
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
