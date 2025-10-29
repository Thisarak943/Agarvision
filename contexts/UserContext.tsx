// context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserData, isAuthenticated, clearAuthData } from '../services/api';
import { userAPI, authAPI } from '../services/api';

interface User {
  id: number;  // Changed from string to number to match your API response
  email: string;
  firstname: string;
  lastname: string;
  is_verified?: boolean;
  phone?: string;
  address?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      const authenticated = await isAuthenticated();
      setIsLoggedIn(authenticated);

      if (authenticated) {
        // Try to get user data from storage first
        const storedUser = await getUserData();
        
        if (storedUser) {
          setUser(storedUser);
        }
        
        // Then fetch fresh data from API
        try {
          const response = await userAPI.getProfile();
          // Handle both "customer" and "user" response formats
          const userData = response.customer || response.user;
          if (userData) {
            setUser(userData);
          }
        } catch (error) {
          console.log('Error fetching user profile:', error);
        }
      }
    } catch (error) {
      console.log('Error loading user data:', error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await userAPI.getProfile();
      // Handle both "customer" and "user" response formats
      const userData = response.customer || response.user;
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.log('Error refreshing user:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.log('Error during logout:', error);
      await clearAuthData();
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        isLoggedIn,
        refreshUser,
        logout,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};