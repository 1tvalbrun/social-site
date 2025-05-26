'use client';

import { useState, useEffect, useCallback } from 'react';
import WordPressPostCard from '@/components/features/wordpress-post-card';
import CreatePostCard from '@/components/features/create-post-card';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/common/button';
import { useAuth } from '@/contexts/auth-context';
import {
  getBuddyBossPosts,
  WordPressPost,
  createPost,
  fetchWPUsersForMinors,
} from '@/services/wordpress-api';
import { Message } from '@/components/common/message';

// Number of posts to load per page
const POSTS_PER_PAGE = 20;

export default function Feed() {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const [userIsMinor, setUserIsMinor] = useState<any>(null);

  // Memoize functions that are dependencies in useEffect
  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      console.log(
        `Loading more posts: page ${nextPage}, per_page ${POSTS_PER_PAGE}`
      );
      const morePosts = await getBuddyBossPosts(nextPage, POSTS_PER_PAGE);

      console.log(`Loaded ${morePosts.length} additional posts`);

      if (morePosts.length > 0) {
        setPosts(prevPosts => [...prevPosts, ...morePosts]);
        setPage(nextPage);
        setHasMore(morePosts.length === POSTS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
      if (error instanceof Error) {
        setError(`Failed to load more posts: ${error.message}`);
      } else {
        setError('Failed to load more posts. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  // Fetch WordPress posts on initial load and refresh
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Fetching posts: page ${page}, per_page ${POSTS_PER_PAGE}`);
      const fetchedPosts = await getBuddyBossPosts(1, POSTS_PER_PAGE);

      console.log(`Fetched ${fetchedPosts.length} posts`);

      // Log first post title for debugging
      if (fetchedPosts.length > 0) {
        console.log('First post title:', fetchedPosts[0]?.title?.rendered);
      }
      setPosts(fetchedPosts);
      setPage(1);

      // If we got fewer posts than requested, there are no more
      setHasMore(fetchedPosts.length === POSTS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching WordPress posts:', error);
      if (error instanceof Error) {
        setError(`Failed to load posts: ${error.message}`);
      } else {
        setError('Failed to load posts. Please try again later.');
      }
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    const getUsers = async () => {
      try {
        const data = await fetchWPUsersForMinors();
        setUserIsMinor(data); // Save the data to state
      } catch (error) {
        console.error('Error fetching minors:', error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, [refreshTrigger, fetchPosts]);

  // Handle new post submission
  const handlePostSubmit = async (content: string, title: string) => {
    try {
      // Create a new WordPress post
      const newPost = await createPost({
        title: title,
        content: content,
        status: 'publish',
      });

      // Add the new post to the beginning of the posts array
      // Using functional update to avoid closure issues
      setPosts(prevPosts => [newPost, ...prevPosts]);

      return true;
    } catch (error) {
      console.error('Error creating post:', error);

      // Error is already handled in the CreatePostCard component
      return false;
    }
  };

  // Handle refresh of all posts
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Clear error message
  const handleDismissError = () => {
    setError(null);
  };

  // Detect when user scrolls to bottom - using useCallback to memoize the event handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        !loading &&
        hasMore &&
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 300
      ) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, loadMorePosts]);

  return (
    <div className="py-4">
      {/* Create Post Card - only show if authenticated */}
      {isAuthenticated && <CreatePostCard onPostSubmit={handlePostSubmit} />}

      {/* Error display */}
      <Message
        message={error || ''}
        type="error"
        title="Error"
        className="mb-4"
        onDismiss={handleDismissError}
      />

      {/* Refresh Button */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          {posts.length > 0 &&
            `Showing ${posts.length} post${posts.length !== 1 ? 's' : ''}`}
        </div>
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
        {initialLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length > 0 ? (
          posts.map(post => (
            <WordPressPostCard
              key={post.id}
              post={post}
              userIsMinor={userIsMinor}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No posts found.{' '}
            {isAuthenticated
              ? 'Create your first post!'
              : 'Please log in to create posts.'}
          </div>
        )}

        {/* Loading indicator for pagination */}
        {loading && !initialLoading && (
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
