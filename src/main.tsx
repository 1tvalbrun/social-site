import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'next-themes';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth-context';
import App from './App';
import './index.css';
import { registerServiceWorker, setupInstallPrompt } from './utils/serviceWorker';

// Register service worker for PWA functionality
registerServiceWorker();

// Setup install prompt handling
setupInstallPrompt();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
