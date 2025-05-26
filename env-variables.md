# Environment Variables

This document explains how environment variables are used in the application.

## Setup

1. Create a `.env` file in the root directory of the project
2. Add the following variables to the file:

```
# WordPress API endpoint
VITE_WORDPRESS_API_URL=https://cms.icgjc.social
# WordPress lost password path
VITE_WORDPRESS_LOST_PASSWORD_PATH=/wp-login.php?action=lostpassword
```

## Variables

| Variable                            | Description                         | Example                             |
| ----------------------------------- | ----------------------------------- | ----------------------------------- |
| `VITE_WORDPRESS_API_URL`            | The base URL for the WordPress site | `https://cms.icgjc.social`          |
| `VITE_WORDPRESS_LOST_PASSWORD_PATH` | The path for password recovery      | `/wp-login.php?action=lostpassword` |

## Implementation Details

This application uses Vite's built-in environment variable system. Vite exposes environment variables on the special `import.meta.env` object.

Key features of Vite's environment variable handling:

1. Only variables prefixed with `VITE_` are exposed to your client-side code
2. Environment variables are statically replaced at build time
3. Variables can be loaded from various `.env` files depending on the current mode

## Usage

In your React components:

```tsx
// Access the environment variable with fallback
const WP_API_URL =
  import.meta.env.VITE_WORDPRESS_API_URL || 'https://cms.icgjc.social';
```

## Type Safety

For TypeScript type safety, you can add type definitions for your custom environment variables:

```tsx
// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WORDPRESS_API_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## Security Notes

- Never expose sensitive information through environment variables prefixed with `VITE_`, as these will be included in your client bundle
- For sensitive values, use server-side environment variables without the `VITE_` prefix
