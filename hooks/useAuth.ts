// hooks/useAuth.ts
import { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        // Simulate checking stored auth token
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // Simulate API login
      const mockUser: User = {
        id: '1',
        username,
        email: `${username}@example.com`,
        firstName: 'John',
        lastName: 'Doe'
      };
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = async () => {
    setUser(null);
  };

  const signup = async (userData: any) => {
    try {
      // Simulate API signup
      const newUser: User = {
        id: '1',
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName
      };
      setUser(newUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Signup failed' };
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    signup
  };
};