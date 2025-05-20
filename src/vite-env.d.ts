/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_WORDPRESS_API_URL: string;
  readonly VITE_WORDPRESS_LOST_PASSWORD_PATH: string;
  // add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
