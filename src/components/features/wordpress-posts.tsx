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
import { WordPressPost, getComments, addComment } from '@/services/wordpress-api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/common/dialog';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/common/avatar';
import { Textarea } from '@/components/common/textarea';

interface WordPressPostsProps {
  posts: WordPressPost[];
  className?: string;
}

export default function WordPressPosts({ posts, className }: WordPressPostsProps) {
  // Track liked posts
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});
  const [selectedPost, setSelectedPost] = useState<WordPressPost | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  
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
  
  // Create safe HTML content
  const createSafeHTML = (htmlContent: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Remove potentially harmful elements/attributes
    const scripts = tempDiv.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    
    // Update links to open in new tab and add rel attributes for security
    const links = tempDiv.querySelectorAll('a');
    links.forEach(link => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
    
    return tempDiv.innerHTML;
  };
  
  // Handle opening the full post dialog
  const handleReadMore = async (post: WordPressPost) => {
    setSelectedPost(post);
    await loadComments(post.id);
  };
  
  // Load comments for the post
  const loadComments = async (postId: number) => {
    if (loadingComments) return;
    
    setLoadingComments(true);
    try {
      const postComments = await getComments(postId);
      setComments(postComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };
  
  // Handle submitting a new comment
  const handleSubmitComment = async () => {
    if (!newComment.trim() || submittingComment || !selectedPost) return;
    
    setSubmittingComment(true);
    try {
      const comment = await addComment(selectedPost.id, newComment);
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };
  
  // Extract featured image if available
  const getFeaturedImage = (post: WordPressPost): string | null => {
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
  
  // Extract author information
  const getAuthorInfo = (post: WordPressPost): { name: string; avatar: string } => {
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

  return (
    <>
      <div className={cn("space-y-6", className)}>
        {posts.map((post) => {
          const handleClickReadMore = (e: React.MouseEvent) => {
            e.preventDefault();
            handleReadMore(post);
          };
          
          return (
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
                  <button
                    onClick={handleClickReadMore}
                    className="hover:underline text-left w-full"
                  >
                    <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                  </button>
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
                    onClick={handleClickReadMore}
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
                  onClick={handleClickReadMore}
                >
                  <span>Read More</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      {/* Full Post Dialog */}
      {selectedPost && (
        <Dialog 
          open={!!selectedPost} 
          onOpenChange={(open) => !open && setSelectedPost(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle 
                className="text-2xl font-bold" 
                dangerouslySetInnerHTML={{ __html: selectedPost.title.rendered }} 
              />
              <DialogDescription className="flex items-center gap-2 mt-2">
                {selectedPost._embedded?.author?.[0] && (
                  <>
                    <Avatar className="h-6 w-6">
                      <AvatarImage 
                        src={getAuthorInfo(selectedPost).avatar} 
                        alt={getAuthorInfo(selectedPost).name} 
                      />
                      <AvatarFallback>{getAuthorInfo(selectedPost).name[0]}</AvatarFallback>
                    </Avatar>
                    <span>{getAuthorInfo(selectedPost).name} • {formatDate(selectedPost.date)}</span>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            
            {/* Featured image */}
            {getFeaturedImage(selectedPost) && (
              <div className="w-full max-h-96 overflow-hidden my-4">
                <img 
                  src={getFeaturedImage(selectedPost) || undefined} 
                  alt={selectedPost.title.rendered} 
                  className="w-full object-contain max-h-full"
                />
              </div>
            )}
            
            {/* Post content */}
            <div className="prose prose-lg dark:prose-invert max-w-none my-6">
              <div dangerouslySetInnerHTML={{ __html: createSafeHTML(selectedPost.content.rendered) }} />
            </div>
            
            {/* Comments section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <h3 className="font-semibold text-lg mb-4">Comments</h3>
              
              {/* New comment form */}
              <div className="mb-6">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  className="w-full mb-2"
                />
                <Button 
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || submittingComment}
                  className="mt-2"
                >
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
              
              {/* List of comments */}
              <div className="space-y-4">
                {loadingComments ? (
                  <div className="text-center py-4 text-muted-foreground">Loading comments...</div>
                ) : comments.length > 0 ? (
                  comments.map(comment => (
                    <div key={comment.id} className="border-b border-gray-100 dark:border-gray-800 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage 
                            src={comment.author_avatar_urls?.['96'] || '/placeholder.svg?height=40&width=40'} 
                            alt={comment.author_name} 
                          />
                          <AvatarFallback>{comment.author_name?.[0] || 'C'}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{comment.author_name}</span>
                        <span className="text-muted-foreground text-sm">•</span>
                        <span className="text-muted-foreground text-sm">{formatDate(comment.date)}</span>
                      </div>
                      <div 
                        className="pl-8 text-sm"
                        dangerouslySetInnerHTML={{ __html: createSafeHTML(comment.content.rendered) }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-2 text-muted-foreground">No comments yet. Be the first to comment!</div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
} 