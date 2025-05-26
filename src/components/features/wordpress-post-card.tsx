import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/common/card';
import { Button } from '@/components/common/button';
import {
  Calendar,
  Tag,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  WordPressPost,
  WordPressUser,
  getComments,
  addComment,
  handleReport,
  getCommentsBuddyBoss,
} from '@/services/wordpress-api';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/common/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/common/dialog';
import { Textarea } from '@/components/common/textarea';
import { Typography, Stack } from '@mui/material';

interface WordPressPostCardProps {
  post: WordPressPost;
  className?: string;
  userIsMinor: any;
}

export default function WordPressPostCard({
  post,
  className,
  userIsMinor,
}: WordPressPostCardProps) {
  // Track liked posts
  const [liked, setLiked] = useState(false);
  const [showFullPost, setShowFullPost] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

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
    if (
      post._embedded &&
      post._embedded.author &&
      post._embedded.author.length > 0
    ) {
      const author = post._embedded.author[0];
      const avatarUrl = author.avatar_urls
        ? // Get largest avatar size available
          author.avatar_urls['96'] ||
          author.avatar_urls['48'] ||
          author.avatar_urls['24']
        : '/placeholder.svg?height=40&width=40';

      return {
        name: author.name,
        avatar: avatarUrl,
      };
    }

    // Default values if author info not available
    return {
      name: 'WordPress User',
      avatar: '/placeholder.svg?height=40&width=40',
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
        return media.media_details.sizes.medium?.source_url || media.source_url;
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

    // Update links to open in new tab and add rel attributes for security
    const links = tempDiv.querySelectorAll('a');
    links.forEach(link => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });

    return tempDiv.innerHTML;
  };

  // Handle opening the full post dialog
  const handleReadMore = async () => {
    setShowFullPost(true);
    await loadComments();
  };

  // Load comments for the post
  const loadComments = async () => {
    if (loadingComments) return;

    setLoadingComments(true);
    try {
      const postComments = await getCommentsBuddyBoss(post.id);
      setComments(postComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  // Handle submitting a new comment
  const handleSubmitComment = async () => {
    if (!newComment.trim() || submittingComment) return;

    setSubmittingComment(true);
    try {
      const comment = await addComment(post.id, newComment);
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Get author information
  const author = getAuthorInfo();

  // Get featured image
  const featuredImage = getFeaturedImage();

  const minorBadge = (
    <span
      style={{
        width: '100px',
        background: 'red',
        color: 'white',
        padding: '2px 6px',
        borderRadius: '12px',
        fontSize: '1rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      Minor
    </span>
  );
  return (
    <>
      <Card
        className={cn(
          'border border-gray-200 dark:border-border bg-white dark:bg-card overflow-hidden hover:shadow-md transition-shadow duration-200',
          className
        )}
      >
        <CardHeader className="p-4 pb-2">
          {userIsMinor?.some(
            (u: any) => u.id === Number(post.user_id) && u.isMinor
          ) && minorBadge}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback>{author.name[0]}</AvatarFallback>
              </Avatar>

              <div>
                <div className="font-semibold text-foreground">{post.name}</div>
                <div className="text-sm text-gray-500 dark:text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(post.date)}
                </div>
              </div>
            </div>
          </div>

          <CardTitle className="text-xl font-bold text-foreground hover:text-primary transition-colors duration-200 mt-2">
            <button
              onClick={handleReadMore}
              className="hover:underline text-left w-full"
            >
              <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            </button>
          </CardTitle>
        </CardHeader>
        {post.bp_media_ids?.map(media => (
          <img
            key={media.id}
            src={media.attachment_data?.activity_thumb}
            alt={media.title}
            className="w-full rounded-md mt-4"
          />
        ))}

        {post.bp_videos?.map(video => (
          <video
            key={video.id}
            controls
            poster={video.attachment_data?.video_activity_thumb}
            className="w-full mt-4 rounded-md"
          >
            <source src={video.download_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ))}

        {/* Featured image if available */}
        {featuredImage && (
          <div
            className="w-full h-60 overflow-hidden cursor-pointer"
            onClick={handleReadMore}
          >
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
                  __html: createSafeHTML(post.excerpt.rendered),
                }}
              />
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: createSafeHTML(
                    post.content.rendered.slice(0, 300) +
                      (post.content.rendered.length > 300 ? '...' : '')
                  ),
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
              onClick={handleReadMore}
            >
              <MessageSquare className="h-4 w-4" />
              <span>
                {post.comment_count === undefined
                  ? 'Comment'
                  : `${post.comment_count} Comment${post.comment_count !== 1 ? 's' : ''}`}
              </span>
            </Button>
            {!post.reported ? (
              <button
                onClick={() => handleReport(post.id)}
                className="text-xs text-red-600 hover:underline"
              >
                {post.report_button_text || 'Report'}
              </button>
            ) : (
              <button className="text-xs text-red-600 hover:underline">
                "Already Reported"
              </button>
            )}

            {post.reported && (
              <span className="text-xs text-gray-400 italic">
                Already reported
              </span>
            )}

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
            onClick={handleReadMore}
          >
            <span>Read More</span>
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </CardFooter>
      </Card>

      {/* Full Post Dialog */}
      <Dialog open={showFullPost} onOpenChange={setShowFullPost}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle
              className="text-2xl font-bold"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
            <DialogDescription className="flex items-center gap-2 mt-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback>{author.name[0]}</AvatarFallback>
              </Avatar>
              <span>
                {post.name} • {formatDate(post.date)}
              </span>
            </DialogDescription>
          </DialogHeader>

          {/* Featured image */}
          {featuredImage && (
            <div className="w-full max-h-96 overflow-hidden my-4">
              <img
                src={featuredImage}
                alt={post.title.rendered}
                className="w-full object-contain max-h-full"
              />
            </div>
          )}

          {/* Post content */}
          <div className="prose prose-lg dark:prose-invert max-w-none my-6">
            <div
              dangerouslySetInnerHTML={{
                __html: createSafeHTML(post.content.rendered),
              }}
            />
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
                <div className="text-center py-4 text-muted-foreground">
                  Loading comments...
                </div>
              ) : comments.length > 0 ? (
                comments.map(comment => (
                  <div
                    key={comment.id}
                    className="border-b border-gray-100 dark:border-gray-800 pb-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={
                            comment.author_avatar_urls?.['96'] ||
                            '/placeholder.svg?height=40&width=40'
                          }
                          alt={comment.author_name}
                        />
                        <AvatarFallback>
                          {comment.author_name?.[0] || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{comment.author_name}</span>
                      <span className="text-muted-foreground text-sm">•</span>
                      <span className="text-muted-foreground text-sm">
                        {formatDate(comment.date)}
                      </span>
                    </div>
                    <div
                      className="pl-8 text-sm"
                      dangerouslySetInnerHTML={{
                        __html: createSafeHTML(comment.content.rendered),
                      }}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-2 text-muted-foreground">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
