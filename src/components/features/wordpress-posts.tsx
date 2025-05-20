import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/common/card';
import { Button } from '@/components/common/button';
import { Calendar, Tag, ExternalLink, MessageSquare, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WordPressPost } from '@/services/wordpress-api';

interface WordPressPostsProps {
  posts: WordPressPost[];
  className?: string;
}

export default function WordPressPosts({ posts, className }: WordPressPostsProps) {
  // Track liked posts
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});
  
  if (!posts || posts.length === 0) {
    return (
      <Card className="border border-gray-200 dark:border-border bg-white dark:bg-card p-6">
        <p className="text-muted-foreground text-center">No posts found</p>
      </Card>
    );
  }

  // Function to format date nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  // Handle like button click
  const handleLike = (postId: number) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <div className={cn("space-y-6", className)}>
      {posts.map((post) => (
        <Card 
          key={post.id} 
          className="border border-gray-200 dark:border-border bg-white dark:bg-card overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          <CardHeader className="p-6 pb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.date)}</span>
            </div>
            
            <CardTitle className="text-xl font-bold text-foreground hover:text-primary transition-colors duration-200">
              <a 
                href={post.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {post.title.rendered}
              </a>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 pt-0">
            <div
              className="text-foreground prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
            />
          </CardContent>
          
          <CardFooter className="p-6 pt-0 flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Button
                variant="ghost" 
                size="sm"
                className="flex items-center gap-1 px-2 h-8"
                onClick={() => handleLike(post.id)}
              >
                <Heart 
                  className={`h-4 w-4 ${likedPosts[post.id] ? 'fill-primary text-primary' : ''}`} 
                />
                <span>Like</span>
              </Button>
              
              <Button
                variant="ghost" 
                size="sm"
                className="flex items-center gap-1 px-2 h-8"
                onClick={() => window.open(post.link + '#comments', '_blank')}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Comment</span>
              </Button>
              
              {post.categories && post.categories.length > 0 && (
                <div className="flex items-center gap-1 ml-2">
                  <Tag className="h-4 w-4" />
                  <span>Category {post.categories[0]}</span>
                </div>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              className="ml-auto"
              onClick={() => window.open(post.link, '_blank')}
            >
              <span>Read More</span>
              <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 