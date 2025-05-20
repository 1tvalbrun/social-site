# WordPress Plugin Guide for Post Permissions

This guide will help you create a custom WordPress plugin that allows non-admin user roles (like authors, contributors, and editors) to create posts through the REST API.

## Instructions

1. Log in to your WordPress admin dashboard
2. Navigate to "Plugins" > "Add New" > "Upload Plugin"
3. Or create a new plugin folder on your server with the following file:

### File: wp-content/plugins/custom-rest-api-permissions/custom-rest-api-permissions.php

```php
<?php
/**
 * Plugin Name: Custom REST API Permissions
 * Description: Allows non-admin roles to create posts through the REST API
 * Version: 1.0
 * Author: Your Name
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

/**
 * Add REST API capabilities to Editor, Author, and Contributor roles
 */
function custom_add_rest_capabilities() {
    // Get all relevant roles
    $roles = array('editor', 'author', 'contributor');
    
    foreach ($roles as $role_name) {
        $role = get_role($role_name);
        
        // Skip if role doesn't exist
        if (!$role) {
            continue;
        }
        
        // Add the create_posts capability for REST API
        $role->add_cap('create_posts', true);
        
        // Allow these roles to edit their own posts via the API
        $role->add_cap('edit_posts', true);
    }
}

// Register the function to run on plugin activation
register_activation_hook(__FILE__, 'custom_add_rest_capabilities');

/**
 * Modify REST API permissions for post creation
 */
function custom_allow_post_creation($allowed, $request) {
    if (!$allowed && current_user_can('edit_posts')) {
        return true;
    }
    return $allowed;
}

// Apply to the post creation REST endpoint
add_filter('rest_pre_dispatch', 'custom_modify_post_permissions', 10, 3);

function custom_modify_post_permissions($result, $server, $request) {
    $route = $request->get_route();
    
    // Check if this is a request to create a post
    if (strpos($route, '/wp/v2/posts') !== false && $request->get_method() === 'POST') {
        add_filter('rest_post_check_permissions', 'custom_allow_post_creation', 10, 2);
    }
    
    return $result;
}
```

4. Activate the plugin in your WordPress dashboard
5. Test creating posts with non-admin accounts through your React application

## Alternative: Modify wp-config.php (Less Secure)

If you can't create a plugin, you can add this code to your theme's functions.php or wp-config.php, but a plugin is recommended for better organization and security.

## Further Customization

This plugin grants basic capabilities. You may want to add more granular controls based on your specific needs, such as:

- Limiting the number of posts a user can create per day
- Restricting certain categories or taxonomies
- Adding capability checks for featured images

Remember to test thoroughly after making these changes to ensure security is maintained.

## Important Security Note

Expanding REST API permissions always comes with security implications. Make sure you:

1. Have a secure authentication system in place (which you already do with JWT)
2. Consider using additional validation on submitted post content
3. Implement rate limiting if needed 