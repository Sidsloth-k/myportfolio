import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cacheService } from '../utils/cache';

interface User {
  id: number;
  username: string;
  full_name?: string;
  email?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // First check cache
        const cachedUser = cacheService.getUser();
        if (cachedUser) {
          console.log('AuthContext: Using cached user');
          setUser(cachedUser);
          setIsLoading(false);
          
          // Verify token in background
          try {
            const apiService = (await import('../services/api')).default;
            const response = await apiService.verifyToken();
            if (response.valid && response.user) {
              setUser(response.user);
              cacheService.setUser(response.user);
            } else {
              // Token invalid, clear cache
              cacheService.clearUser();
              setUser(null);
            }
          } catch (error) {
            console.error('Token verification failed:', error);
            cacheService.clearUser();
            setUser(null);
          }
          return;
        }

        // No cache, verify token
        const apiService = (await import('../services/api')).default;
        const response = await apiService.verifyToken();
        if (response.valid && response.user) {
          setUser(response.user);
          cacheService.setUser(response.user);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        cacheService.clearUser();
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      console.log('AuthContext: Starting login...');
      const apiService = (await import('../services/api')).default;
      const response = await apiService.login(username, password);
      console.log('AuthContext: Login response:', response);
      
      if (response.success && response.data) {
        console.log('AuthContext: Setting user:', response.data.user);
        setUser(response.data.user);
        cacheService.setUser(response.data.user);
        console.log('AuthContext: User set, isAuthenticated should be true');
      } else {
        console.error('AuthContext: Login failed - no success or data:', response);
        throw new Error(response.error || 'Login failed');
      }
    } catch (error: any) {
      console.error('AuthContext: Login error caught:', error);
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      const apiService = (await import('../services/api')).default;
      await apiService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      cacheService.clearUser();
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

