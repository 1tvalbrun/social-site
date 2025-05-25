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
  error: string | null;
  isLoginInProgress: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoginInProgress, setIsLoginInProgress] = useState(false);

  // Enhanced checkAuth function with better error handling
  const checkAuth = useCallback(async () => {
    try {
      console.log('🔍 Checking authentication status...');
      
      // Check WordPress auth status
      if (isWpAuthenticated()) {
        try {
          const wpUser = getCurrentUser();
          
          if (wpUser) {
            const userData = {
              id: wpUser.id || null,
              name: wpUser.displayName || wpUser.username,
              email: wpUser.email,
              username: wpUser.username,
              avatar: wpUser.avatarUrl
            };
            
            setUser(userData);
            console.log('✅ User authenticated:', userData.username);
          } else {
            throw new Error('No user data available');
          }
        } catch (error) {
          console.error('❌ Error parsing WordPress user:', error);
          // If there's an error, log out
          wpLogout();
          setUser(null);
        }
      } else {
        console.log('ℹ️ User not authenticated');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Expose checkAuth for external use
  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true);
    await checkAuth();
  }, [checkAuth]);

  // Check if user is already logged in on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Enhanced login function with better error handling and loading states
  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    if (isLoginInProgress) {
      console.log('⚠️ Login already in progress, skipping...');
      return false;
    }

    setIsLoginInProgress(true);
    setError(null);
    
    try {
      console.log('🔐 Starting WordPress authentication for:', username);
      
      // Use WordPress authentication
      const wpResponse = await wpAuthenticate({
        username, 
        password
      });
      
      console.log('✅ WordPress authentication successful');
      
      // Get the current user after successful auth
      const wpUser = getCurrentUser();
      
      if (wpUser) {
        const userData = {
          id: wpUser.id || null,
          name: wpUser.displayName || wpUser.username,
          email: wpUser.email,
          username: wpUser.username,
          avatar: wpUser.avatarUrl
        };
        
        setUser(userData);
        setError(null);
        
        console.log('🚀 User state updated, ready for navigation:', userData.username);
        
        // Small delay to ensure state is fully updated before navigation
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return true;
      } else {
        const fallbackError = 'Authentication successful but user data not available. Please try logging in again.';
        setError(fallbackError);
        setUser(null);
        return false;
      }
      
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // Extract clean error message and ensure it doesn't trigger error boundary
      let errorMessage = 'Login failed. Please check your credentials and try again.';
      
      if (error instanceof Error) {
        // Use the cleaned error message from the WordPress API
        errorMessage = error.message;
        
        // Additional safety - if the error message still contains HTML or URLs, clean it
        if (errorMessage.includes('<') || errorMessage.includes('http')) {
          errorMessage = 'The username or password you entered is incorrect. Please check your credentials and try again.';
        }
      }
      
      // Set the error in state (this will be displayed on the login form)
      setError(errorMessage);
      setUser(null);
      
      // Do NOT re-throw the error - this prevents it from reaching the error boundary
      console.log('🛡️ Error handled in auth context, will be displayed on login form');
      return false;
    } finally {
      setIsLoginInProgress(false);
    }
  }, [isLoginInProgress]);

  // Enhanced logout function
  const logout = useCallback(() => {
    console.log('🚪 Logging out user...');
    
    try {
      // WordPress logout
      wpLogout();
      setUser(null);
      setError(null);
      
      console.log('✅ Logout successful');
      
      // Force navigation to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Even if logout fails, clear local state and redirect
      setUser(null);
      setError(null);
      window.location.href = '/login';
    }
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    isLoginInProgress,
    login,
    logout,
    clearError,
    checkAuthStatus,
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