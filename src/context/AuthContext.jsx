import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

const DEMO_CREDENTIALS = {
  user: { email: 'guest@example.com', password: 'Password@123' },
  admin: { email: 'admin@grandaurelia.com', password: 'Admin@123' }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('hotel_current_user_v1');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Verify and sync current user session with backend on mount
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('hotel_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.getMe();
        if (response && response.user) {
          setCurrentUser(response.user);
          localStorage.setItem('hotel_current_user_v1', JSON.stringify(response.user));
        }
      } catch (err) {
        console.warn('Session verification failed, logging out:', err.message);
        localStorage.removeItem('hotel_token');
        localStorage.removeItem('hotel_current_user_v1');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authAPI.login(email, password);
      if (res.token && res.user) {
        localStorage.setItem('hotel_token', res.token);
        localStorage.setItem('hotel_current_user_v1', JSON.stringify(res.user));
        setCurrentUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, error: res.message || 'Login failed' };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authAPI.register(userData);
      if (res.token && res.user) {
        localStorage.setItem('hotel_token', res.token);
        localStorage.setItem('hotel_current_user_v1', JSON.stringify(res.user));
        setCurrentUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, error: res.message || 'Registration failed' };
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('hotel_token');
    localStorage.removeItem('hotel_current_user_v1');
    setCurrentUser(null);
  };

  // Quick switch for demo ease (convenient for college evaluation)
  const switchDemoRole = async (role) => {
    const creds = DEMO_CREDENTIALS[role] || DEMO_CREDENTIALS.user;
    return await login(creds.email, creds.password);
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    loading,
    login,
    register,
    logout,
    switchDemoRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
