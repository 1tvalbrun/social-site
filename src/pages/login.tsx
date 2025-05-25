import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { Input } from '@/components/common/input';
import { Button } from '@/components/common/button';
import { Message, MessageType } from '@/components/common/message';
import { navigateAfterAuth, getIntendedPath, debugNavigation } from '@/utils/navigation';

// Get the WordPress base URL from environment variables
const WP_BASE_URL = import.meta.env.VITE_WORDPRESS_API_URL;
// Get the WordPress lost password path from environment variables
const WP_LOST_PASSWORD_PATH = import.meta.env.VITE_WORDPRESS_LOST_PASSWORD_PATH;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading, error, clearError, isLoginInProgress } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('');

  // Check if already authenticated on component mount
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const intendedPath = getIntendedPath(location.state, '/home');
      console.log('✅ Already authenticated on login page, redirecting to:', intendedPath);
      navigateAfterAuth(navigate, intendedPath);
    }
  }, [isAuthenticated, isLoading, navigate, location.state]);

  // Handle auth errors from context
  useEffect(() => {
    if (error) {
      setMessage(error);
      setMessageType('error');
    }
  }, [error]);

  // Early return for authenticated users (backup to useEffect)
  if (isAuthenticated && !isLoading) {
    const intendedPath = getIntendedPath(location.state, '/home');
    return <Navigate to={intendedPath} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any existing messages
    setMessage('');
    setMessageType('');
    clearError();
    
    if (!username || !password) {
      setMessage('Please enter both username and password.');
      setMessageType('error');
      return;
    }
    
    try {
      console.log('🔐 Starting login process for:', username);
      
      const success = await login(username, password);
      
      if (success) {
        console.log('✅ Login successful, preparing navigation...');
        setMessage('Login successful! Redirecting...');
        setMessageType('success');
        
        // Get intended destination
        const intendedPath = getIntendedPath(location.state, '/home');
        console.log('🏠 Redirecting to:', intendedPath);
        
        // Small delay to show success message, then navigate
        setTimeout(() => {
          navigateAfterAuth(navigate, intendedPath);
        }, 500);
      } else {
        // Error should be handled by the auth context and displayed via useEffect
        console.log('❌ Login failed - error will be displayed from auth context');
        
        // If no error was set by auth context, show a fallback message
        setTimeout(() => {
          if (!error && !message) {
            setMessage('Login failed. Please check your credentials and try again.');
            setMessageType('error');
          }
        }, 100);
      }
    } catch (error) {
      // This catch block should rarely be reached now that auth context handles errors
      console.error('❌ Unexpected login submission error:', error);
      setMessage('An unexpected error occurred. Please try again.');
      setMessageType('error');
    }
  };

  const handleDismissMessage = () => {
    setMessage('');
    setMessageType('');
    clearError();
  };

  // Debug function for development
  const handleDebug = () => {
    if (import.meta.env.DEV) {
      debugNavigation();
      console.log('🔍 Auth State:', {
        isAuthenticated,
        isLoading,
        isLoginInProgress,
        error,
        user: isAuthenticated ? 'User present' : 'No user',
        locationState: location.state
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="w-full max-w-md bg-white dark:bg-card rounded-xl shadow-lg border border-gray-200 dark:border-border p-8 flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Sign in to ICGJC</h1>
          <p className="text-muted-foreground">
            Please enter your WordPress credentials to continue
          </p>
        </div>
        
        <Message 
          message={message} 
          type={messageType} 
          className="mb-2"
          onDismiss={handleDismissMessage}
        />
        
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username
            </label>
            <Input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="w-full"
              placeholder="Your username"
              disabled={isLoginInProgress}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full"
              placeholder="Your password"
              disabled={isLoginInProgress}
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-2"
            disabled={isLoginInProgress || isLoading}
          >
            {isLoginInProgress ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
        
        <div className="flex flex-col gap-2 text-sm text-center mt-2">
          <Link
            to="/forgot-password"
            className="text-primary hover:underline focus:underline"
          >
            Forgot your password?
          </Link>
          <p className="text-muted-foreground">
            Don&apos;t have an account? Please contact your site administrator.
          </p>
          
          {import.meta.env.DEV && (
            <button
              type="button"
              onClick={handleDebug}
              className="text-xs text-gray-400 hover:text-gray-600 mt-4"
            >
              Debug Info (Dev Only)
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 