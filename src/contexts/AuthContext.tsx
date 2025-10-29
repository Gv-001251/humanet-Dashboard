import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { LoginCredentials, LoginResponse, User } from '../types/auth.types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (partial: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_USER_KEY = 'humanet_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem(STORAGE_USER_KEY);

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
            method: 'GET',
            credentials: 'include'
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            setToken('cookie-based');
          } else {
            localStorage.removeItem(STORAGE_USER_KEY);
          }
        } catch (error) {
          console.error('Failed to verify session', error);
          localStorage.removeItem(STORAGE_USER_KEY);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to login');
    }

    const data = await response.json() as LoginResponse;

    setToken('cookie-based');
    setUser(data.user);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.user));
  };

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_USER_KEY);
  };

  const updateUser = (partial: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial };
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const value = useMemo(() => ({ user, token, isLoading, login, logout, updateUser }), [user, token, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
