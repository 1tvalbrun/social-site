import { useState } from 'react';
import { Button } from '@/components/common/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/common/card';
import { Loader2 } from 'lucide-react';
import { authenticate, isAuthenticated, logout } from '@/services/wordpress-api';
import { Message } from '@/components/common/message';

interface WordPressAuthFormProps {
  onSuccess?: () => void;
  className?: string;
}

export default function WordPressAuthForm({ onSuccess, className }: WordPressAuthFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error before validation
    setError(null);
    
    if (!username.trim() || !password.trim()) {
      setError('Please provide both username and password');
      return;
    }

    setIsLoading(true);
    
    try {
      await authenticate({ username, password });
      setIsLoggedIn(true);
      
      // Clear form
      setUsername('');
      setPassword('');
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };
  
  const handleDismissError = () => {
    setError(null);
  };

  // Get user info if logged in
  const userInfo = isLoggedIn ? JSON.parse(localStorage.getItem('wp_user') || '{}') : null;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          {isLoggedIn ? 'WordPress Account' : 'WordPress Login'}
        </CardTitle>
      </CardHeader>

      {isLoggedIn ? (
        <CardContent className="space-y-4">
          <Message
            type="success"
            message={`Logged in as ${userInfo?.displayName || userInfo?.username}`}
            className="text-sm"
            dismissible={false}
          />
          
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="w-full"
          >
            Log Out
          </Button>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Message
              type="error"
              message={error || ''}
              className="text-sm"
              onDismiss={handleDismissError}
            />
            
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary/30 focus:border-primary dark:bg-gray-800 dark:text-gray-100"
                placeholder="WordPress username"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary/30 focus:border-primary dark:bg-gray-800 dark:text-gray-100"
                placeholder="WordPress password"
                disabled={isLoading}
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : 'Log In'}
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
} 