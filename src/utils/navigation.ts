import { NavigateFunction } from 'react-router-dom';

// Navigation state management
let navigationInProgress = false;
let navigationTimeout: NodeJS.Timeout | null = null;

/**
 * Safe navigation function that prevents rapid navigation calls and throttling issues
 */
export const safeNavigate = (
  navigate: NavigateFunction, 
  path: string, 
  options: { replace?: boolean; state?: any } = {}
): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Prevent rapid navigation calls
    if (navigationInProgress) {
      console.log('⚠️ Navigation already in progress, skipping...');
      resolve();
      return;
    }

    navigationInProgress = true;
    
    // Clear any existing timeout
    if (navigationTimeout) {
      clearTimeout(navigationTimeout);
    }

    // Add small delay to prevent throttling
    navigationTimeout = setTimeout(() => {
      try {
        console.log(`🧭 Navigating to: ${path}`);
        navigate(path, { replace: true, ...options });
        resolve();
      } catch (error) {
        console.error('❌ Navigation error:', error);
        reject(error);
      } finally {
        navigationInProgress = false;
      }
    }, 150); // 150ms delay to prevent throttling
  });
};

/**
 * Force navigation using window.location (useful for hard redirects)
 */
export const forceNavigate = (path: string): void => {
  console.log(`🔄 Force navigating to: ${path}`);
  window.location.href = path;
};

/**
 * Navigate with authentication check
 */
export const navigateWithAuth = (
  navigate: NavigateFunction,
  path: string,
  isAuthenticated: boolean,
  options: { replace?: boolean; state?: any } = {}
): Promise<void> => {
  if (!isAuthenticated && path !== '/login') {
    console.log('🚫 Not authenticated, redirecting to login');
    return safeNavigate(navigate, '/login', { replace: true });
  }
  
  if (isAuthenticated && path === '/login') {
    console.log('✅ Already authenticated, redirecting to home');
    return safeNavigate(navigate, '/home', { replace: true });
  }
  
  return safeNavigate(navigate, path, options);
};

/**
 * Navigate after successful authentication
 */
export const navigateAfterAuth = (
  navigate: NavigateFunction,
  intendedPath?: string,
  options: { replace?: boolean } = { replace: true }
): Promise<void> => {
  const targetPath = intendedPath || '/home';
  console.log(`🏠 Post-auth navigation to: ${targetPath}`);
  
  return safeNavigate(navigate, targetPath, options);
};

/**
 * Get intended path from location state or use default
 */
export const getIntendedPath = (locationState: any, defaultPath: string = '/home'): string => {
  return locationState?.from?.pathname || defaultPath;
};

/**
 * Reset navigation state (useful for cleanup)
 */
export const resetNavigationState = (): void => {
  navigationInProgress = false;
  if (navigationTimeout) {
    clearTimeout(navigationTimeout);
    navigationTimeout = null;
  }
};

/**
 * Check if navigation is currently in progress
 */
export const isNavigationInProgress = (): boolean => {
  return navigationInProgress;
};

/**
 * Navigate with retry mechanism
 */
export const navigateWithRetry = (
  navigate: NavigateFunction,
  path: string,
  maxRetries: number = 3,
  options: { replace?: boolean; state?: any } = {}
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await safeNavigate(navigate, path, options);
        resolve();
        return;
      } catch (error) {
        console.warn(`Navigation attempt ${attempt} failed:`, error);
        
        if (attempt === maxRetries) {
          console.error(`Navigation failed after ${maxRetries} attempts, using force navigate`);
          forceNavigate(path);
          resolve();
          return;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 200 * attempt));
      }
    }
  });
};

/**
 * Debug navigation state
 */
export const debugNavigation = (): void => {
  console.log('🔍 Navigation Debug Info:', {
    navigationInProgress,
    hasTimeout: !!navigationTimeout,
    currentPath: window.location.pathname,
    currentSearch: window.location.search,
    currentHash: window.location.hash,
    historyLength: window.history.length
  });
}; 