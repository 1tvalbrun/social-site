import { useState } from 'react';
import { Button } from '@/components/common/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/common/card';
import { Loader2 } from 'lucide-react';
import { createPost } from '@/services/wordpress-api';

interface WordPressPostFormProps {
  onPostCreated: () => void;
  apiUrl: string;
  className?: string;
}

export default function WordPressPostForm({ onPostCreated, apiUrl, className }: WordPressPostFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Please provide both title and content');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create post using our API service
      await createPost({
        title: title,
        content: content,
        status: 'publish'
      });
      
      // Reset form
      setTitle('');
      setContent('');
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
      // Notify parent component to refresh posts
      onPostCreated();
      
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Create New Post</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-md text-sm">
              Post created successfully!
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary/30 focus:border-primary dark:bg-gray-800 dark:text-gray-100"
              placeholder="Post title"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium text-foreground">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary/30 focus:border-primary dark:bg-gray-800 dark:text-gray-100 min-h-[150px]"
              placeholder="Write your post content here..."
              disabled={isSubmitting}
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : 'Publish Post'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 