import { useState, useEffect } from 'react';
import WordPressPosts from '@/components/features/wordpress-posts';
import WordPressAuthForm from '@/components/features/wordpress-auth-form';
import WordPressPostForm from '@/components/features/wordpress-post-form';
import { Button } from '@/components/common/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { getPosts, apiUrl, WordPressPost, isAuthenticated } from '@/services/wordpress-api';

export default function WordPressPostsPage() {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const fetchedPosts = await getPosts(page, 10);
        
        if (page === 1) {
          setPosts(fetchedPosts);
        } else {
          setPosts(prev => [...prev, ...fetchedPosts]);
        }
        
        // If we got fewer posts than requested, there are no more to load
        if (fetchedPosts.length < 10) {
          setHasMore(false);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [page, refreshTrigger]);
  
  // Check authentication status on mount and when it might change
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, [refreshTrigger]);
  
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };
  
  const handleRefresh = () => {
    setPage(1);
    setHasMore(true);
    setRefreshTrigger(prev => prev + 1);
  };
  
  const handlePostCreated = () => {
    // Reset to page 1 and refresh posts
    setPage(1);
    setRefreshTrigger(prev => prev + 1);
  };
  
  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    // Refresh posts in case there are user-specific posts now visible
    handleRefresh();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
        WordPress Posts
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          {/* Post Creation Form - Only show if logged in */}
          {isLoggedIn && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Create New Post</h2>
              <WordPressPostForm 
                apiUrl={apiUrl} 
                onPostCreated={handlePostCreated} 
              />
            </div>
          )}
          
          {/* Refresh Button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-foreground">Latest Posts</h2>
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
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md">
              {error}
            </div>
          )}
          
          {/* Posts */}
          {posts.length > 0 ? (
            <WordPressPosts posts={posts} />
          ) : !loading ? (
            <div className="p-8 text-center border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-card">
              <p className="text-muted-foreground">No posts found</p>
            </div>
          ) : null}
          
          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          
          {/* Load More Button */}
          {!loading && hasMore && posts.length > 0 && (
            <div className="mt-6 flex justify-center">
              <Button onClick={handleLoadMore} variant="outline">
                Load More Posts
              </Button>
            </div>
          )}
        </div>
        
        {/* Sidebar with Authentication */}
        <div className="lg:col-span-1">
          <WordPressAuthForm 
            onSuccess={handleAuthSuccess} 
            className="sticky top-24"
          />
          
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm text-muted-foreground">
            <h3 className="font-medium mb-2 text-foreground">About WordPress Integration</h3>
            <p>
              This integration allows you to view and create posts on your WordPress site.
              Log in with your WordPress credentials to create new content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 