import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('hotel_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Check if saved user token is still valid on start
  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem('hotel_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.getMe();
        if (response && response.user) {
          setCurrentUser(response.user);
          localStorage.setItem('hotel_user', JSON.stringify(response.user));
        }
      } catch (err) {
        // If token expired, clear it
        localStorage.removeItem('hotel_token');
        localStorage.removeItem('hotel_user');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  // Simple Login function
  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      if (data && data.token && data.user) {
        localStorage.setItem('hotel_token', data.token);
        localStorage.setItem('hotel_user', JSON.stringify(data.user));
        setCurrentUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.message || 'Login failed' };
    } catch (err) {
      return { success: false, error: err.message || 'Login error' };
    }
  };

  // Simple Register function
  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData);
      if (data && data.token && data.user) {
        localStorage.setItem('hotel_token', data.token);
        localStorage.setItem('hotel_user', JSON.stringify(data.user));
        setCurrentUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.message || 'Registration failed' };
    } catch (err) {
      return { success: false, error: err.message || 'Registration error' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('hotel_token');
    localStorage.removeItem('hotel_user');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isAdmin: currentUser?.role === 'admin',
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
