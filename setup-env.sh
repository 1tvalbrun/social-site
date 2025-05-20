#!/bin/bash

# Create .env file
echo "Creating .env file with default settings..."
cat > .env << EOL
# WordPress API endpoint
VITE_WORDPRESS_API_URL=https://cms.icgjc.social
# WordPress lost password path
VITE_WORDPRESS_LOST_PASSWORD_PATH=/wp-login.php?action=lostpassword
EOL

echo "Environment setup complete. You can now run 'npm run dev'" 