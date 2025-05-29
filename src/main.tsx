import * as React from 'react';

import { BrowserRouter } from 'react-router-dom';

import { ThemeProvider } from 'next-themes';
import * as ReactDOM from 'react-dom/client';

import { AuthProvider } from '@/contexts/auth-context';

import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement === null) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
