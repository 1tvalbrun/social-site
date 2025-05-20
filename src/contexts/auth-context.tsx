import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  authenticate as wpAuthenticate, 
  WordPressCredentials, 
  isAuthenticated as isWpAuthenticated, 
  logout as wpLogout,
  getCurrentUser
} from '@/services/wordpress-api';

interface User {
  id: string | number | null;
  name: string;
  email?: string;
  username: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize the checkAuth function to avoid recreating it on every render
  const checkAuth = useCallback(() => {
    // Check WordPress auth status
    if (isWpAuthenticated()) {
      try {
        const wpUser = getCurrentUser();
        
        if (wpUser) {
          setUser({
            id: wpUser.id || null,
            name: wpUser.displayName || wpUser.username,
            email: wpUser.email,
            username: wpUser.username,
            avatar: wpUser.avatarUrl
          });
        }
      } catch (error) {
        console.error('Error parsing WordPress user:', error);
        // If there's an error, log out
        wpLogout();
        setUser(null);
      }
    } else {
      // Ensure user is null if not authenticated
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  // Check if user is already logged in on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login function using WordPress authentication - memoized to avoid recreating on render
  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      // Use WordPress authentication only
      const wpResponse = await wpAuthenticate({
        username, 
        password
      });
      
      // If we reach here, WordPress auth was successful
      const wpUser = getCurrentUser();
      
      if (wpUser) {
        // Set the user in our app's context - functional update not needed as this isn't based on prev state
        setUser({
          id: wpUser.id || null,
          name: wpUser.displayName || wpUser.username,
          email: wpUser.email,
          username: wpUser.username,
          avatar: wpUser.avatarUrl
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  // Logout function - memoized to maintain reference stability
  const logout = useCallback(() => {
    // WordPress logout
    wpLogout();
    setUser(null);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders of consumers
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 