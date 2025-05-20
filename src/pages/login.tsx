import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { Input } from '@/components/common/input';
import { Button } from '@/components/common/button';
import { Message, MessageType } from '@/components/common/message';

// Get the WordPress base URL from environment variables with fallback
const WP_BASE_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://cms.icgjc.social';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to home
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Always reset the message state before a new submission
    setMessage('');
    setMessageType('');
    
    if (!username || !password) {
      setMessage('Please enter both username and password.');
      setMessageType('error');
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        setMessage('Login successful!');
        setMessageType('success');
        // Auth context will handle the authenticated state
        setTimeout(() => navigate('/'), 1000);
      } else {
        setMessage('Incorrect username or password.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('An error occurred during login. Please check your credentials and try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleDismissMessage = () => {
    setMessage('');
    setMessageType('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="w-full max-w-md bg-white dark:bg-card rounded-xl shadow-lg border border-gray-200 dark:border-border p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-center mb-2">Sign in to WordPress</h1>
        <p className="text-center text-muted-foreground">
          Please enter your WordPress credentials to continue
        </p>
        
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
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-2"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <div className="flex flex-col gap-2 text-sm text-center mt-2">
          <a
            href={`${WP_BASE_URL}/wp-login.php?action=lostpassword`}
            className="text-primary hover:underline focus:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Forgot your password?
          </a>
          <p className="text-muted-foreground">
            Don&apos;t have an account? Please contact your site administrator.
          </p>
        </div>
      </div>
    </div>
  );
} 