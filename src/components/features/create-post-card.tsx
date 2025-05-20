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
import { ImageIcon, Smile, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface CreatePostCardProps {
  onPostSubmit: (content: string, title: string) => Promise<boolean>;
}

export default function CreatePostCard({ onPostSubmit }: CreatePostCardProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || !title.trim()) return;

    setIsSubmitting(true);
    
    try {
      // Submit to WordPress
      const success = await onPostSubmit(content, title);
      
      if (success) {
        // Reset the form
        setContent('');
        setTitle('');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
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
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-wrap items-center justify-between gap-2">
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
          disabled={!content.trim() || !title.trim() || isSubmitting}
          variant={isSubmitting ? "secondary" : "outline"}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </Button>
      </CardFooter>
    </Card>
  );
}
