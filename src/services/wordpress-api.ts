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
const WP_API_BASE_URL = import.meta.env.VITE_WORDPRESS_API_URL || 'https://stg-headlesssocial-stage.kinsta.cloud/';
const WP_API_URL = `${WP_API_BASE_URL}/wp-json`;

// WordPress post interface
export interface WordPressPost {
  id: number;
  date: string;
  slug: string;
  link: string;
  name: string;
  can_report: boolean;
  reported: boolean;
  report_button_text: string;
  user_id: number;
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
 * Get posts from BuddyBoss Social Feed
 */
export async function getBuddyBossPosts(page = 1, perPage = 10): Promise<WordPressPost[]> {
  try {
    const response = await fetch(
      `${WP_API_URL}/buddyboss/v1/activity?page=${page}&per_page=${perPage}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch BuddyBoss posts: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching BuddyBoss posts:', error);
    throw error;
  }
}

export async function fetchWPUsersForMinors (): Promise<WordPressUser[]> {

  const token = localStorage.getItem('wp_token');
  
  try {
   const response = await fetch(`${WP_API_URL}/wp/v2/users?per_page=100`, {
      //const response = await fetch(`${WP_API_URL}/buddyboss/v1/members`,{

      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    const users = await response.json();
    const mapped = users.map((user: any) => ({
      id: user.id,
      name: user.name,
      isMinor: user.is_minor,
    }));
    return(mapped);
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

/**
 * Get groups from BuddyBoss
 */
export async function getBuddyBossGroups(page = 1, perPage = 10): Promise<any[]> {
  try {
    const response = await fetch(
      `${WP_API_URL}/buddyboss/v1/groups?page=${page}&per_page=${perPage}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch BuddyBoss groups: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching BuddyBoss groups:', error);
    throw error;
  }
}

//Get Groups the User is a Member Of

export async function getUserGroups(userId: number) {
  const token = localStorage.getItem('wp_token');
  if (!token) {
    throw new Error('Authentication token not found. Please log in.');
  }

  const response = await fetch(`${WP_API_URL}/buddyboss/v1/groups?user_id=${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch user groups');
  return await response.json();
}

// Report an activity post
export async function handleReport(postId: number) {
  const token = localStorage.getItem('wp_token');
  if (!token) return alert('Please login.');

  try {
    const res = await fetch(`${WP_API_URL}/custom/v1/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        object_id: postId,
        reason: 'Inappropriate content',
      }),
    });

    const data = await res.json();
    alert(data.message);
    window.location.reload();
  } catch (err) {
    console.error('Failed to report post:', err);
    alert('Failed to report.');
  }
}
// Create a new activity post
export async function createBuddyBossPost(content: any, mediaIds = []) {
  const token = localStorage.getItem('wp_token');
  try {
    const res = await fetch(`${WP_API_URL}/buddyboss/v1/activity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content,
        type: 'activity_update',
        bp_media_ids: mediaIds,
        privacy: 'public'
      }),
    });
    return await res.json();
  } catch (err) {
    console.error('Error creating post:', err);
    throw err;
  }
}

// Update an existing activity post
export async function updateBuddyBossPost(postId: number, content: any) {
  const token = localStorage.getItem('wp_token');
  try {
    const res = await fetch(`${WP_API_URL}/buddyboss/v1/activity/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    return await res.json();
  } catch (err) {
    console.error('Error updating post:', err);
    throw err;
  }
}

// Delete an activity post
export async function deleteBuddyBossPost(postId: number) {
  const token = localStorage.getItem('wp_token');
  try {
    const res = await fetch(`${WP_API_URL}/buddyboss/v1/activity/${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err) {
    console.error('Error deleting post:', err);
    throw err;
  }
}

export async function getCommentsBuddyBoss(activityId: number) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/activity/${activityId}/comments`);
  if (!response.ok) throw new Error('Failed to fetch comments');
  return await response.json();
}

export async function addCommentBuddyBoss(activityId: number, content: string, token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/activity`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      content,
      component: 'activity',
      type: 'activity_comment',
      primary_item_id: activityId
    })
  });

  if (!response.ok) throw new Error('Failed to add comment');
  return await response.json();
}

//  Like a Post
export async function likeBuddyBossPost(postId: number, token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/activity/${postId}/favorite`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to like post');
  return await response.json();
}

//  Unlike a Post
export async function unlikeBuddyBossPost(postId: number, token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/activity/${postId}/unfavorite`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to unlike post');
  return await response.json();
}

//  Upload Media (Image/Video)
export async function uploadBuddyBossMedia(file: File, token: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('context', 'activity');

  const response = await fetch(`${WP_API_URL}/wp/v2/media`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData,
  });

  if (!response.ok) throw new Error('Failed to upload media');
  return await response.json();
}

//  Attach Media to Post
export async function createPostWithMedia(content: string, mediaId: number, token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/activity`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      content,
      media_ids: [mediaId],
      component: 'activity',
      type: 'activity_update'
    })
  });
  if (!response.ok) throw new Error('Failed to create post with media');
  return await response.json();
}

//  Get Pending Posts for Moderation (Assuming a custom endpoint exists)
export async function getPendingPosts(token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/moderation/activity?status=pending`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch pending posts');
  return await response.json();
}

//  Approve Post
export async function approvePost(postId: number, token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/moderation/activity/${postId}/approve`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to approve post');
  return await response.json();
}

//  Reject Post
export async function rejectPost(postId: number, token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/moderation/activity/${postId}/reject`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to reject post');
  return await response.json();
}
//Get a Single Post by ID

export async function getBuddyBossPostById(postId: number) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/activity/${postId}`);
  if (!response.ok) throw new Error('Failed to fetch the post');
  return await response.json();
}
//Get User's Favorite Posts

export async function getUserFavorites(userId: number, token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/members/${userId}/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch favorites');
  return await response.json();
}

//Join a Group

export async function joinGroup(groupId: number, token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/groups/${groupId}/join`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to join group');
  return await response.json();
}
//Leave a Group

export async function leaveGroup(groupId: number, token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/groups/${groupId}/leave`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to leave group');
  return await response.json();
}
//Get Group Members

export async function getGroupMembers(groupId: number, token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/groups/${groupId}/members`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch group members');
  return await response.json();
}
//Upload a Profile Image

export async function uploadProfileImage(file: File, token: string) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${WP_API_URL}/buddyboss/v1/members/me/avatar`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) throw new Error('Failed to upload profile image');
  return await response.json();
}
//Update Profile Field

export async function updateProfileField(userId: number, fieldId: number, value: string, token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/members/${userId}/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      field_id: fieldId,
      value
    })
  });

  if (!response.ok) throw new Error('Failed to update profile field');
  return await response.json();
}

//Get Messages Inbox

export async function getInboxMessages(token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/messages`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Failed to fetch inbox messages');
  return await response.json();
}
//Send a Message to a User

export async function sendMessage(recipientId: number, subject: string, content: string, token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      recipients: [recipientId],
      subject,
      content
    })
  });

  if (!response.ok) throw new Error('Failed to send message');
  return await response.json();
}
//Send Friend Request

export async function sendFriendRequest(userId: number, token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/friends/${userId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Failed to send friend request');
  return await response.json();
}
//Accept Friend Request

export async function acceptFriendRequest(requestId: number, token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/friends/requests/${requestId}/accept`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Failed to accept friend request');
  return await response.json();
}
//Reject Friend Request

export async function rejectFriendRequest(requestId: number, token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/friends/requests/${requestId}/reject`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Failed to reject friend request');
  return await response.json();
}
//Get User Notifications

export async function getUserNotifications(token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Failed to fetch notifications');
  return await response.json();
}
//Mark Notification as Read

export async function markNotificationRead(notificationId: number, token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/notifications/${notificationId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Failed to mark notification as read');
  return await response.json();
}
// Get Activity Mentions

export async function getMentions(token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/activity/mentions`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Failed to fetch mentions');
  return await response.json();
}

//Block a User

export async function blockUser(userId: number, token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/blocks/${userId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Failed to block user');
  return await response.json();
}
//Unblock a User

export async function unblockUser(userId: number, token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/blocks/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Failed to unblock user');
  return await response.json();
}
//Search Activities by Term

export async function searchActivities(term: string, token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/activity?search=${encodeURIComponent(term)}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Failed to search activity posts');
  return await response.json();
}

//Pin a Post (if allowed)

export async function pinActivity(activityId: number, token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/activity/${activityId}/pin`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Failed to pin activity');
  return await response.json();
}

//invite user to group
export async function inviteUserToGroup(groupId: number, userId: number, token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/groups/${groupId}/invites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ user_id: userId })
  });

  if (!response.ok) throw new Error('Failed to invite user to group');
  return await response.json();
}


// Update User Profile
export async function updateUserProfile(userId: number, fields: Record<string, any>, token: string) {
  const response = await fetch(`${WP_API_URL}/buddyboss/v1/xprofile/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(fields)
  });

  if (!response.ok) throw new Error('Failed to update user profile');
  return await response.json();
}











/// This file contains functions to interact with the WordPress REST API and not BuddyBoss API, will delete the code bwelow when done testing BuddyBoss API

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

/**
 * Request a password reset
 * @param email The user's email address
 * @returns Promise that resolves to success message
 */
export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  try {
    // WordPress REST API doesn't have a standard endpoint for this
    // Most WordPress sites have plugins like "JWT Authentication for WP-API" or 
    // similar that provide additional endpoints
    
    // This assumes you have a plugin or custom endpoint that handles password reset
    const response = await fetch(`${WP_API_URL}/password-reset/v1/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to request password reset: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error requesting password reset:', error);
    throw error;
  }
}

// Export API base URL
export const apiUrl = WP_API_URL; 