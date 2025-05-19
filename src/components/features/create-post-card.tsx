import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/common/avatar';
import { Button } from '@/components/common/button';
import { Card, CardContent, CardFooter } from '@/components/common/card';
import { Textarea } from '@/components/common/textarea';
import { ImageIcon, Smile, MapPin } from 'lucide-react';

interface CreatePostCardProps {
  onPostSubmit: (content: string) => void;
}

export default function CreatePostCard({ onPostSubmit }: CreatePostCardProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!content.trim()) return;

    setIsSubmitting(true);

    // Submit the post
    onPostSubmit(content);

    // Reset the form
    setContent('');
    setIsSubmitting(false);
  };

  return (
    <Card className="border border-gray-200 dark:border-border bg-white dark:bg-card mb-4">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src="/placeholder.svg?height=40&width=40"
              alt="Your avatar"
            />
            <AvatarFallback>YA</AvatarFallback>
          </Avatar>
          <div className="flex-1">
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
          disabled={!content.trim() || isSubmitting}
          variant="outline"
        >
          Post
        </Button>
      </CardFooter>
    </Card>
  );
}
