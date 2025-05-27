import { useState, useEffect, ReactNode } from 'react';
import {
  AuthContext,
  type User,
  type AuthContextType,
} from './auth-context-types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // For demo purposes - in a real app this would call an API
    if (email === 'user@example.com' && password === 'password') {
      const user = {
        id: '1',
        name: 'Jane Doe',
        email: 'user@example.com',
      };

      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
