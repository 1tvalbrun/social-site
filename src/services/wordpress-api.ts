// WordPress API service

// Declare the window environment variables interface
declare global {
  interface Window {
    ENV?: {
      NEXT_PUBLIC_WORDPRESS_API_URL?: string;
    };
  }
}

// Define the base URL for the WordPress API
const WP_API_BASE_URL = import.meta.env.VITE_WORDPRESS_API_URL || 'https://cms.icgjc.social';
const WP_API_URL = `${WP_API_BASE_URL}/wp-json`;

// WordPress post interface
export interface WordPressPost {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: {
    rendered: string;
    raw?: string;
  };
  content: {
    rendered: string;
    raw?: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  status: string;
  categories: number[];
  tags: number[];
  featured_media: number;
  author: number;
  // Added for better integration
  _embedded?: {
    author?: Array<WordPressUser>;
    'wp:featuredmedia'?: Array<{
      source_url: string;
      media_details?: {
        sizes?: {
          thumbnail?: {
            source_url: string;
          };
          medium?: {
            source_url: string;
          };
        };
      };
    }>;
  };
  comment_count?: number;
}

// WordPress User
export interface WordPressUser {
  id: number;
  name: string;
  url: string;
  description: string;
  slug: string;
  avatar_urls?: {
    [key: string]: string;
  };
}

// WordPress Comment
export interface WordPressComment {
  id: number;
  post: number;
  parent: number;
  author: number;
  author_name: string;
  author_url: string;
  date: string;
  content: {
    rendered: string;
  };
  author_avatar_urls?: {
    [key: string]: string;
  };
}

// WordPress credentials interface
export interface WordPressCredentials {
  username: string;
  password: string;
}

// WordPress auth token response
interface TokenResponse {
  token: string;
  user_email?: string;
  user_nicename?: string;
  user_display_name?: string;
  
  // Add alternative property names used by some JWT plugins
  jwt_token?: string;
  user?: {
    email?: string;
    name?: string;
    display_name?: string;
  };
  data?: {
    token?: string;
    user?: {
      email?: string;
      display_name?: string;
    };
  };
}

// WordPress user profile from token
export interface WordPressUserProfile {
  id?: number;
  email?: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
}

/**
 * Get posts from WordPress API
 */
export async function getPosts(page = 1, perPage = 10): Promise<WordPressPost[]> {
  try {
    const response = await fetch(
      `${WP_API_URL}/wp/v2/posts?page=${page}&per_page=${perPage}&_embed=1`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching WordPress posts:', error);
    throw error;
  }
}

/**
 * Get a single post by ID
 */
export async function getPost(id: number): Promise<WordPressPost> {
  try {
    const response = await fetch(`${WP_API_URL}/wp/v2/posts/${id}?_embed=1`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching WordPress post ${id}:`, error);
    throw error;
  }
}

/**
 * Get comments for a post
 */
export async function getComments(postId: number): Promise<WordPressComment[]> {
  try {
    const response = await fetch(`${WP_API_URL}/wp/v2/comments?post=${postId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    throw error;
  }
}

/**
 * Add a comment to a post
 */
export async function addComment(postId: number, content: string): Promise<WordPressComment> {
  const token = localStorage.getItem('wp_token');
  
  if (!token) {
    throw new Error('Authentication token not found. Please log in.');
  }
  
  try {
    const response = await fetch(`${WP_API_URL}/wp/v2/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        post: postId,
        content: content
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to add comment: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error adding comment to post ${postId}:`, error);
    throw error;
  }
}

/**
 * Create a new post
 */
export async function createPost(post: {
  title: string;
  content: string;
  status?: string;
  categories?: number[];
}): Promise<WordPressPost> {
  const token = localStorage.getItem('wp_token');
  
  if (!token) {
    throw new Error('Authentication token not found. Please log in.');
  }
  
  try {
    const response = await fetch(`${WP_API_URL}/wp/v2/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: post.title,
        content: post.content,
        status: post.status || 'publish',
        categories: post.categories || []
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to create post: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating WordPress post:', error);
    throw error;
  }
}

/**
 * Update an existing post
 */
export async function updatePost(
  id: number,
  post: {
    title?: string;
    content?: string;
    status?: string;
    categories?: number[];
  }
): Promise<WordPressPost> {
  const token = localStorage.getItem('wp_token');
  
  if (!token) {
    throw new Error('Authentication token not found. Please log in.');
  }
  
  try {
    const response = await fetch(`${WP_API_URL}/wp/v2/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(post)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to update post: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating WordPress post ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a post
 */
export async function deletePost(id: number): Promise<void> {
  const token = localStorage.getItem('wp_token');
  
  if (!token) {
    throw new Error('Authentication token not found. Please log in.');
  }
  
  try {
    const response = await fetch(`${WP_API_URL}/wp/v2/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to delete post: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error deleting WordPress post ${id}:`, error);
    throw error;
  }
}

/**
 * Get the current user's profile
 */
export function getCurrentUser(): WordPressUserProfile | null {
  const storedUser = localStorage.getItem('wp_user');
  
  if (!storedUser) {
    return null;
  }
  
  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error('Error parsing stored WordPress user:', error);
    return null;
  }
}

/**
 * Get user by ID
 */
export async function getUser(id: number): Promise<WordPressUser> {
  try {
    const response = await fetch(`${WP_API_URL}/wp/v2/users/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching WordPress user ${id}:`, error);
    throw error;
  }
}

/**
 * Authenticate with WordPress
 * This requires JWT Authentication plugin to be installed on WordPress
 */
export async function authenticate(credentials: WordPressCredentials): Promise<any> {
  try {
    console.log('Attempting WordPress authentication...');
    
    // Try the default JWT auth endpoint
    const response = await fetch(`${WP_API_URL}/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Authentication failed:', errorData);
      throw new Error(errorData.message || 'Authentication failed');
    }
    
    const data = await response.json() as TokenResponse;
    console.log('Authentication successful, response:', data);
    
    // Extract token - handle different response formats from various JWT plugins
    const token = data.token || data.jwt_token || data.data?.token || '';
    if (!token) {
      console.error('No token found in response:', data);
      throw new Error('No authentication token found in response');
    }
    
    // Extract user info if available
    const userEmail = data.user_email || data.user?.email || data.data?.user?.email || '';
    const userDisplayName = data.user_display_name || data.user?.display_name || data.data?.user?.display_name || credentials.username;
    
    // Get user ID if available in response (different JWT plugins might return it in different locations)
    let userId = null;
    if (data.data && 'user' in data.data && typeof data.data.user === 'object' && data.data.user !== null && 'id' in data.data.user) {
      userId = data.data.user.id;
    }
    
    // Store the token for future requests
    localStorage.setItem('wp_token', token);
    localStorage.setItem('wp_user', JSON.stringify({
      id: userId,
      email: userEmail,
      username: credentials.username,
      displayName: userDisplayName
    }));
    
    return data;
  } catch (error) {
    console.error('WordPress authentication error:', error);
    throw error;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('wp_token');
}

/**
 * Log out user
 */
export function logout(): void {
  localStorage.removeItem('wp_token');
  localStorage.removeItem('wp_user');
}

// Export API base URL
export const apiUrl = WP_API_URL; 