import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { INITIAL_USERS } from '../services/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('caffera_token');
    const savedUser = localStorage.getItem('caffera_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('caffera_token');
        localStorage.removeItem('caffera_user');
      }
    } else {
      // Default to Admin user for quick frictionless demo
      const defaultAdmin = INITIAL_USERS[0];
      const mockToken = `mock_jwt_token_Admin_${Date.now()}`;
      setToken(mockToken);
      setUser(defaultAdmin);
      localStorage.setItem('caffera_token', mockToken);
      localStorage.setItem('caffera_user', JSON.stringify(defaultAdmin));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authService.login(credentials);
      if (res.success && res.data) {
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.message || 'Login gagal' };
    } catch (err) {
      return { success: false, message: err.message || 'Terjadi kesalahan sistem' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  // Quick switch role (Admin <-> Cashier) for grading & demo purposes
  const switchRole = (targetRole) => {
    const matchedUser =
      INITIAL_USERS.find((u) => u.role.toLowerCase() === targetRole.toLowerCase()) || {
        id: targetRole === 'Admin' ? 1 : 2,
        name: targetRole === 'Admin' ? 'Azhar Farizi (Admin)' : 'Sarah Nabila (Cashier)',
        email: targetRole === 'Admin' ? 'admin@caffera.com' : 'cashier@caffera.com',
        role: targetRole,
        avatar:
          targetRole === 'Admin'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      };

    const mockToken = `mock_jwt_token_${targetRole}_${Date.now()}`;
    setUser(matchedUser);
    setToken(mockToken);
    localStorage.setItem('caffera_token', mockToken);
    localStorage.setItem('caffera_user', JSON.stringify(matchedUser));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'Admin',
    isCashier: user?.role === 'Cashier',
    login,
    logout,
    switchRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
