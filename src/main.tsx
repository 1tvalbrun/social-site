import * as React from 'react';

import { BrowserRouter } from 'react-router-dom';

import { ThemeProvider } from 'next-themes';
import * as ReactDOM from 'react-dom/client';

import App from './App';
import { AuthProvider } from './contexts/auth-context';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement === null) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
