'use client';

import { useState, useEffect } from 'react';
import WordPressPostCard from '@/components/features/wordpress-post-card';
import CreatePostCard from '@/components/features/create-post-card';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/common/button';
import { useAuth } from '@/contexts/auth-context';
import { getPosts, WordPressPost, createPost } from '@/services/wordpress-api';

export default function Feed() {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { isAuthenticated } = useAuth();
  
  // Fetch WordPress posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const fetchedPosts = await getPosts(1, 10); // Get first page of posts
        setPosts(fetchedPosts);
        setPage(1);
        setHasMore(fetchedPosts.length === 10); // If we got 10 posts, there might be more
      } catch (error) {
        console.error('Error fetching WordPress posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [refreshTrigger]);

  // Handle new post submission
  const handlePostSubmit = async (content: string, title: string) => {
    try {
      // Create a new WordPress post
      const newPost = await createPost({
        title: title,
        content: content,
        status: 'publish'
      });
      
      // Add the new post to the beginning of the posts array
      setPosts([newPost, ...posts]);
      
      return true;
    } catch (error) {
      console.error('Error creating post:', error);
      return false;
    }
  };
  
  // Handle refresh of all posts
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Load more posts (for infinite scroll)
  const loadMorePosts = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const nextPage = page + 1;
      const morePosts = await getPosts(nextPage, 10);
      
      if (morePosts.length > 0) {
        setPosts([...posts, ...morePosts]);
        setPage(nextPage);
        setHasMore(morePosts.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Detect when user scrolls to bottom
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !loading && hasMore
      ) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, page]);

  return (
    <div className="py-4">
      {/* Create Post Card - only show if authenticated */}
      {isAuthenticated && (
        <CreatePostCard onPostSubmit={handlePostSubmit} />
      )}
      
      {/* Refresh Button */}
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map(post => (
            <WordPressPostCard key={post.id} post={post} />
          ))
        ) : !loading ? (
          <div className="text-center py-8 text-muted-foreground">
            No posts found. {isAuthenticated ? 'Create your first post!' : 'Please log in to create posts.'}
          </div>
        ) : null}
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        
        {/* End of feed indicator */}
        {!hasMore && posts.length > 0 && !loading && (
          <div className="text-center py-4 text-muted-foreground">
            You've reached the end of the feed
          </div>
        )}
      </div>
    </div>
  );
}
