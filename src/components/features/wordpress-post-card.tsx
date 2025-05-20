import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/common/card';
import { Button } from '@/components/common/button';
import { Calendar, Tag, ExternalLink, MessageSquare, Heart, User, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WordPressPost, WordPressUser } from '@/services/wordpress-api';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/common/avatar';

interface WordPressPostCardProps {
  post: WordPressPost;
  className?: string;
}

export default function WordPressPostCard({ post, className }: WordPressPostCardProps) {
  // Track liked posts
  const [liked, setLiked] = useState(false);
  
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
  const handleLike = () => {
    setLiked(!liked);
  };
  
  // Extract author information
  const getAuthorInfo = (): { name: string; avatar: string } => {
    // Check if author is embedded in the post
    if (post._embedded && post._embedded.author && post._embedded.author.length > 0) {
      const author = post._embedded.author[0];
      const avatarUrl = author.avatar_urls ? 
        // Get largest avatar size available
        author.avatar_urls['96'] || author.avatar_urls['48'] || author.avatar_urls['24'] :
        '/placeholder.svg?height=40&width=40';
        
      return {
        name: author.name,
        avatar: avatarUrl
      };
    }
    
    // Default values if author info not available
    return {
      name: 'WordPress User',
      avatar: '/placeholder.svg?height=40&width=40'
    };
  };
  
  // Extract featured image if available
  const getFeaturedImage = (): string | null => {
    if (
      post._embedded && 
      post._embedded['wp:featuredmedia'] && 
      post._embedded['wp:featuredmedia'].length > 0
    ) {
      const media = post._embedded['wp:featuredmedia'][0];
      
      // Try to get medium size first, then full size
      if (media.media_details && media.media_details.sizes) {
        return media.media_details.sizes.medium?.source_url || 
               media.source_url;
      }
      
      return media.source_url || null;
    }
    
    return null;
  };
  
  // Create safe HTML content
  const createSafeHTML = (htmlContent: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Remove potentially harmful elements/attributes
    const scripts = tempDiv.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    
    return tempDiv.innerHTML;
  };
  
  // Get author information
  const author = getAuthorInfo();
  
  // Get featured image
  const featuredImage = getFeaturedImage();

  return (
    <Card 
      className={cn("border border-gray-200 dark:border-border bg-white dark:bg-card overflow-hidden hover:shadow-md transition-shadow duration-200", className)}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={author.avatar}
                alt={author.name}
              />
              <AvatarFallback>{author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-foreground">{author.name}</div>
              <div className="text-sm text-gray-500 dark:text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(post.date)}
              </div>
            </div>
          </div>
        </div>
        
        <CardTitle className="text-xl font-bold text-foreground hover:text-primary transition-colors duration-200 mt-2">
          <a 
            href={post.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:underline"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </CardTitle>
      </CardHeader>
      
      {/* Featured image if available */}
      {featuredImage && (
        <div className="w-full h-60 overflow-hidden">
          <img 
            src={featuredImage} 
            alt={post.title.rendered} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardContent className="p-4 pt-2">
        <div className="text-foreground prose prose-sm dark:prose-invert max-w-none">
          {post.excerpt?.rendered ? (
            <div 
              dangerouslySetInnerHTML={{ 
                __html: createSafeHTML(post.excerpt.rendered) 
              }} 
            />
          ) : (
            <div 
              dangerouslySetInnerHTML={{ 
                __html: createSafeHTML(post.content.rendered.slice(0, 300) + (post.content.rendered.length > 300 ? '...' : '')) 
              }}
            />
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Button
            variant="ghost" 
            size="sm"
            className="flex items-center gap-1 px-2 h-8"
            onClick={handleLike}
          >
            <ThumbsUp 
              className={`h-4 w-4 ${liked ? 'fill-primary text-primary' : ''}`} 
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
            <span>
              {post.comment_count === undefined 
                ? 'Comment' 
                : `${post.comment_count} Comment${post.comment_count !== 1 ? 's' : ''}`}
            </span>
          </Button>
          
          {post.categories && post.categories.length > 0 && (
            <div className="flex items-center gap-1 ml-2">
              <Tag className="h-4 w-4" />
              <span>WordPress</span>
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
  );
} 