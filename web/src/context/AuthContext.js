import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Auth Context for managing admin authentication state
 */
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem('adminData');
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('adminToken'));

  const login = useCallback((adminData, adminToken) => {
    setAdmin(adminData);
    setToken(adminToken);
    localStorage.setItem('adminData', JSON.stringify(adminData));
    localStorage.setItem('adminToken', adminToken);
  }, []);

  const logout = useCallback(() => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('adminData');
    localStorage.removeItem('adminToken');
  }, []);

  const isAuthenticated = !!token && !!admin;

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
