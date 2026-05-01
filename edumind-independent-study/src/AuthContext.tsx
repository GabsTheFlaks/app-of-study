import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState } from './types';

interface AuthContextType extends AuthState {
  login: (username: string, userId: number) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setState({ user: data.user, isAuthenticated: true, isLoading: false });
      } else {
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (username: string, userId: number) => {
    setState({ user: { username, userId }, isAuthenticated: true, isLoading: false });
  };

  const logout = () => {
    setState({ user: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, checkAuth }}>
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
