import { useState } from 'react';

import { Navigate, useNavigate } from 'react-router-dom';

import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success' | ''>('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to home
  if (isAuthenticated && !isLoading) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  function validateEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');
    if (!email || !password) {
      setMessage('Please enter both email and password.');
      setMessageType('error');
      return;
    }
    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      setMessageType('error');
      return;
    }
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        setMessage('Login successful!');
        setMessageType('success');
        // Auth context will handle the authenticated state
        setTimeout(() => {
          void navigate('/');
        }, 1000);
      } else {
        setMessage('Incorrect email or password.');
        setMessageType('error');
      }
    } catch {
      setMessage('An error occurred during login.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    void handleSubmit(e);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleForgotPassword = () => {
    void navigate('/forgot-password');
  };

  const handleSignupClick = () => {
    void navigate('/signup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="w-full max-w-md bg-white dark:bg-card rounded-xl shadow-lg border border-gray-200 dark:border-border p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-center mb-2">
          Sign in to your account
        </h1>
        {!!message && (
          <div
            className={`rounded-md px-4 py-2 text-sm mb-2 ${
              messageType === 'error'
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
            }`}
            role="alert"
            aria-live="polite"
          >
            {message}
          </div>
        )}
        <form
          className="flex flex-col gap-4"
          onSubmit={handleFormSubmit}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={handleEmailChange}
              required
              className="w-full"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
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
          <button
            type="button"
            className="text-primary hover:underline focus:underline"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </button>
          <span className="text-muted-foreground">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              className="text-primary hover:underline focus:underline"
              onClick={handleSignupClick}
            >
              Sign up
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
