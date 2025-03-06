'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserLoginResponse } from '@/types/auth.type';

interface AuthContextType {
  user: UserLoginResponse | null;
  token: string | null;
  setUser: (user: UserLoginResponse | null) => void;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  clearUser: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserLoginResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken) {
      setToken(storedToken);
    }
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data', error);
      }
    }
  }, []);

  const clearUser = () => {
    setUser(null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        token,
        setUser,
        setToken,
        isAuthenticated: !!token && !!user,
        clearUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};