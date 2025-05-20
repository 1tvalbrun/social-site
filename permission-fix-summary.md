# WordPress REST API Permissions Fix

## The Issue

Your React application can only create posts when logged in as an admin user because WordPress, by default, restricts the ability to create posts via the REST API to administrators only.

## Solution Overview

There are two main approaches to solve this:

1. **WordPress Side (Recommended)**: Modify WordPress permissions to allow other user roles to create posts
2. **React Side**: We've already improved the error handling in the React app to better communicate permission issues

## Implementation Steps

### WordPress Side Solutions

We've provided three options in detailed guide files:

1. **Custom Plugin (wordpress-plugin-guide.md)**: Create a custom WordPress plugin to modify REST API permissions
2. **Existing Plugins (wordpress-plugins-solution.md)**: Use existing WordPress plugins like "WP REST API Controller"
3. **Functions.php Modification**: Add a simple code snippet to your theme's functions.php file

#### Quick Solution (Functions.php)

If you want a quick fix, add this code to your WordPress theme's functions.php file:

```php
/**
 * Allow non-admin users to create posts via REST API
 */
add_filter('rest_pre_dispatch', function ($result, $server, $request) {
    // Only apply to post creation
    if (strpos($request->get_route(), '/wp/v2/posts') !== false && $request->get_method() === 'POST') {
        // Add filter only for this specific request
        add_filter('rest_post_check_permissions', function ($permitted, $request) {
            // If already permitted, don't change
            if ($permitted) return true;
            
            // Allow any logged-in user with basic editing capabilities
            return current_user_can('edit_posts');
        }, 10, 2);
    }
    
    return $result;
}, 10, 3);
```

### React Side Improvements

We've already made improvements to the React application:

1. Added better error handling in the CreatePostCard component
2. Improved error messages in the Feed component
3. Added visual alerts for permission errors

These changes will help users understand when they don't have permission to create posts and guide them to contact an administrator.

## Testing the Solution

After implementing any WordPress-side fix:

1. Create a test user with a non-admin role (Author, Editor, or Contributor)
2. Log in with that user in your React application
3. Try to create a post
4. Verify it works and see the improved error messages if it doesn't

## Security Considerations

When opening up the WordPress REST API:

1. Ensure proper authentication is still enforced
2. Consider rate limiting to prevent abuse
3. Regularly review user roles and capabilities

For more detailed information, please refer to the specific guide files we've created. 