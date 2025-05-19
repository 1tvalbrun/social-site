import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/common/input';
import { Button } from '@/components/common/button';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success' | ''>('');
  const [loading, setLoading] = useState(false);

  function validateEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');
    
    if (!email) {
      setMessage('Please enter your email address.');
      setMessageType('error');
      return;
    }
    
    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      setMessageType('error');
      return;
    }
    
    setLoading(true);
    // Placeholder password reset logic
    setTimeout(() => {
      setLoading(false);
      setMessage('Password reset instructions have been sent to your email.');
      setMessageType('success');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="w-full max-w-md bg-white dark:bg-card rounded-xl shadow-lg border border-gray-200 dark:border-border p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-center mb-2">Reset your password</h1>
        <p className="text-muted-foreground text-center">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
        
        {message && (
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
        
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full"
              placeholder="you@example.com"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full mt-2"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send reset instructions'}
          </Button>
        </form>
        
        <div className="text-sm text-center mt-2">
          <button
            type="button"
            className="text-primary hover:underline focus:underline"
            onClick={() => navigate('/login')}
          >
            Back to sign in
          </button>
        </div>
      </div>
    </div>
  );
} 