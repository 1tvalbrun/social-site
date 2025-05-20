# Solving WordPress REST API Permissions with Existing Plugins

If you don't want to create a custom plugin, you can use existing WordPress plugins to allow non-admin users to create posts through the REST API.

## Option 1: JWT Authentication for WP REST API (Required)

You're already using this plugin for authentication, but make sure it's properly configured:

1. Download from: https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
2. Ensure your `.htaccess` file contains:
   ```
   RewriteEngine on
   RewriteCond %{HTTP:Authorization} ^(.*)
   RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]
   ```
3. Add to wp-config.php:
   ```php
   define('JWT_AUTH_SECRET_KEY', 'your-secret-key');
   define('JWT_AUTH_CORS_ENABLE', true);
   ```

## Option 2: WP REST API Controller

This plugin gives you a simple UI to control REST API permissions:

1. Install and activate the "WP REST API Controller" plugin
2. Navigate to Settings > REST API Controller
3. Find "Posts" in the list
4. Enable "CREATE" permission for the roles you want (Author, Editor, Contributor)
5. Save changes

Download: https://wordpress.org/plugins/wp-rest-api-controller/

## Option 3: Role-Based Access Control for WordPress REST API

This plugin provides fine-grained control over REST API permissions:

1. Install and activate "Role-Based Access Control for WP REST API"
2. Go to Settings > REST API Permissions
3. Find the Posts section
4. Check the "Create" permission for your desired user roles
5. Save changes

Download: https://wordpress.org/plugins/role-based-access-control-for-wp-rest-api/

## Simple Functions.php Method

If you prefer not to use plugins, add this code to your theme's functions.php file:

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

## WordPress User Role Configuration

Another approach is to modify the WordPress roles directly:

1. Install a plugin like "User Role Editor" 
2. Navigate to Users > User Role Editor
3. Select the role you want to modify (e.g., Contributor)
4. Enable "create_posts" and "edit_posts" capabilities
5. Save changes

This method is more permanent and affects all aspects of WordPress, not just the REST API.

## Testing

After implementing any of these solutions:

1. Create a test user with a non-admin role
2. Try to create a post through your React application
3. Verify the post is created successfully and attributed to the correct user

## Important Security Considerations

When opening up REST API capabilities:

1. Ensure proper user authentication is enforced
2. Consider limiting post creation rate to prevent abuse
3. Implement content validation to prevent spam or malicious content
4. Regularly review your user roles and capabilities 