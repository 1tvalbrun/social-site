import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/common/avatar';
import { Button } from '@/components/common/button';
import { Card, CardContent, CardFooter } from '@/components/common/card';
import { Textarea } from '@/components/common/textarea';
import { Input } from '@/components/common/input';
import { ImageIcon, Smile, MapPin, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Message } from '@/components/common/message';

interface CreatePostCardProps {
  onPostSubmit: (content: string, title: string) => Promise<boolean>;
}

export default function CreatePostCard({ onPostSubmit }: CreatePostCardProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!content.trim() || !title.trim()) return;

    // Reset messages before submitting
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Submit to WordPress
      const success = await onPostSubmit(content, title);
      
      if (success) {
        // Reset the form
        setContent('');
        setTitle('');
        setSuccessMessage('Your post was published successfully!');
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError('Failed to create post. Please try again.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      
      // Handle specific permission errors
      if (error instanceof Error) {
        if (error.message.includes('rest_cannot_create') || 
            error.message.includes('permission') || 
            error.message.includes('capability')) {
          setError('You do not have permission to create posts. Please contact your administrator.');
        } else {
          setError(error.message || 'Failed to create post. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear error message
  const handleDismissError = () => {
    setError(null);
  };

  // Clear success message
  const handleDismissSuccess = () => {
    setSuccessMessage(null);
  };

  return (
    <Card className="border border-gray-200 dark:border-border bg-white dark:bg-card mb-4">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user?.avatar || "/placeholder.svg?height=40&width=40"}
              alt="Your avatar"
            />
            <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Input
              placeholder="Title"
              className="border-gray-200 dark:border-border focus:border-primary"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="What's on your mind?"
              className="min-h-[80px] border-gray-200 dark:border-border focus:border-primary"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>
        </div>
        
        {/* Error message */}
        <Message
          message={error || ''}
          type="error"
          title="Error"
          className="mt-3"
          onDismiss={handleDismissError}
        />
        
        {/* Success message */}
        <Message
          message={successMessage || ''}
          type="success"
          title="Success"
          className="mt-3"
          dismissible={true}
          onDismiss={handleDismissSuccess}
        />
      </CardContent>
      <CardFooter className="px-4 py-3 flex justify-between items-center border-t border-gray-100 dark:border-border bg-gray-50/50 dark:bg-card/50">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 dark:text-muted-foreground"
          >
            <ImageIcon className="h-4 w-4 mr-1" />
            Photo
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 dark:text-muted-foreground"
          >
            <Smile className="h-4 w-4 mr-1" />
            Feeling
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 dark:text-muted-foreground"
          >
            <MapPin className="h-4 w-4 mr-1" />
            Location
          </Button>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={!title.trim() || !content.trim() || isSubmitting}
          className="relative"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            "Post"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
