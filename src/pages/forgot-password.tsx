import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/common/input';
import { Button } from '@/components/common/button';
import { Message, MessageType } from '@/components/common/message';
import { requestPasswordReset } from '@/services/wordpress-api';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('');
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
    
    try {
      // Call the WordPress API to request a password reset
      const response = await requestPasswordReset(email);
      
      // Display success message
      setMessage(response.message || 'Password reset instructions have been sent to your email.');
      setMessageType('success');
      
      // Reset form
      setEmail('');
      
      // After 3 seconds, redirect to login page
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Password reset error:', error);
      if (error instanceof Error) {
        setMessage(error.message || 'An error occurred. Please try again later.');
      } else {
        setMessage('An error occurred. Please try again later.');
      }
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
        <h1 className="text-2xl font-bold text-center mb-2">Reset your password</h1>
        <p className="text-muted-foreground text-center">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
        
        <Message 
          message={message} 
          type={messageType} 
          className="mb-2"
          onDismiss={handleDismissMessage}
        />
        
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