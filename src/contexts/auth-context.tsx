import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = () => {
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
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function using WordPress authentication
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Use WordPress authentication only
      const wpResponse = await wpAuthenticate({
        username, 
        password
      });
      
      // If we reach here, WordPress auth was successful
      const wpUser = getCurrentUser();
      
      if (wpUser) {
        // Set the user in our app's context
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
  };

  // Logout function
  const logout = () => {
    // WordPress logout
    wpLogout();
    setUser(null);
  };

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