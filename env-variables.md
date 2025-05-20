# Environment Variables

This document lists the environment variables used in the application.

## Setup

1. Create a `.env` file in the root directory of the project
2. Add the following variables to the file:

```
# WordPress API endpoint
NEXT_PUBLIC_WORDPRESS_API_URL=https://cms.icgjc.social
```

## Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_WORDPRESS_API_URL` | The base URL for the WordPress site | `https://cms.icgjc.social` |

## Usage

These environment variables are used throughout the application to configure the API endpoints. The `NEXT_PUBLIC_` prefix ensures that the variables are accessible in the browser. 