import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'next-themes';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth-context';
import App from './App';
import './index.css';

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
