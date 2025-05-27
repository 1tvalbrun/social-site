import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success' | ''>('');
  const [loading, setLoading] = useState(false);

  function validateEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    // Validation checks
    if (!name || !email || !password || !confirmPassword) {
      setMessage('Please fill in all fields.');
      setMessageType('error');
      return;
    }
    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      setMessageType('error');
      return;
    }
    if (password.length < 8) {
      setMessage('Password must be at least 8 characters long.');
      setMessageType('error');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    // Placeholder signup logic
    setTimeout(() => {
      setLoading(false);
      setMessage('Account created successfully!');
      setMessageType('success');
      // Redirect to login after successful signup
      setTimeout(() => {
        void navigate('/login');
      }, 1500);
    }, 1000);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(e.target.value);
  };

  const handleLoginClick = () => {
    void navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="w-full max-w-md bg-white dark:bg-card rounded-xl shadow-lg border border-gray-200 dark:border-border p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-center mb-2">
          Create an account
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
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-1"
            >
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={handleNameChange}
              required
              className="w-full"
              placeholder="Jane Doe"
            />
          </div>
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
              autoComplete="new-password"
              value={password}
              onChange={handlePasswordChange}
              required
              className="w-full"
              placeholder="Create a password"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              className="w-full"
              placeholder="Confirm your password"
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-2"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>
        <div className="text-sm text-center mt-2">
          <span className="text-muted-foreground">
            Already have an account?{' '}
            <button
              type="button"
              className="text-primary hover:underline focus:underline"
              onClick={handleLoginClick}
            >
              Sign in
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
