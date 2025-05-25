import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import SocialMediaHome from '@/components/layout/social-media-home';
import LoginPage from '@/pages/login';
import ForgotPasswordPage from '@/pages/forgot-password';
import InstallBanner from '@/components/InstallBanner';
import PWADebug from '@/components/PWADebug';
import { getIntendedPath, navigateWithAuth } from '@/utils/navigation';

// Loading component
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    </div>
  );
}

// Error fallback component
function ErrorFallback({ error }: { error?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center max-w-md mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Something went wrong with navigation</h2>
        <p className="text-muted-foreground mb-6">
          {error || "We encountered an unexpected error. This might be a temporary issue."}
        </p>
        <div className="space-y-3">
          <button 
            onClick={() => window.location.href = '/login'}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}

// Root redirect component with PWA launch tracking
function RootRedirect() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    // Don't redirect while auth is loading
    if (isLoading) return;
    
    // Handle PWA launch tracking
    const urlParams = new URLSearchParams(location.search);
    const isPWALaunch = urlParams.get('utm_source') === 'pwa';
    
    if (isPWALaunch) {
      localStorage.setItem('isPWAInstall', 'true');
      console.log('📱 PWA launched from home screen');
    }
    
    // Navigate based on authentication status
    if (isAuthenticated) {
      console.log('✅ User authenticated, redirecting to home');
      navigateWithAuth(navigate, '/home', isAuthenticated);
    } else {
      console.log('🔐 User not authenticated, redirecting to login');
      navigateWithAuth(navigate, '/login', isAuthenticated);
    }
  }, [location.search, navigate, isAuthenticated, isLoading]);

  // Show loading while determining where to redirect
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Fallback redirect (shouldn't be reached due to useEffect)
  return isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />;
}

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // Redirect to login if not authenticated, preserving intended destination
  if (!isAuthenticated) {
    console.log('🚫 Protected route accessed without authentication, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
}

// Public route component (redirects to home if already authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Don't redirect while auth is loading
    if (isLoading) return;
    
    // If already authenticated and trying to access login, redirect to intended destination or home
    if (isAuthenticated && location.pathname === '/login') {
      const intendedPath = getIntendedPath(location.state, '/home');
      console.log('✅ Already authenticated, redirecting to:', intendedPath);
      navigateWithAuth(navigate, intendedPath, isAuthenticated);
    }
  }, [isAuthenticated, isLoading, location.pathname, location.state, navigate]);
  
  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return <>{children}</>;
}

export default function App() {
  const { isLoading, error } = useAuth();
  
  // Only show error fallback for critical system errors, not authentication failures
  // Authentication errors should be handled by the login form
  const isCriticalError = error && (
    error.includes('network') || 
    error.includes('server') || 
    error.includes('system') ||
    error.includes('critical') ||
    error.includes('connection') ||
    error.includes('timeout')
  );
  
  if (isCriticalError && !isLoading) {
    return <ErrorFallback error={error} />;
  }
  
  return (
    <>
      <Routes>
        {/* Explicit root route handler */}
        <Route path="/" element={<RootRedirect />} />
        
        {/* Public routes (redirect to home if authenticated) */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/signup" 
          element={<Navigate to="/login" replace />} 
        />
        
        <Route 
          path="/forgot-password" 
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          } 
        />
        
        {/* Protected routes */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <SocialMediaHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/posts/*" 
          element={
            <ProtectedRoute>
              <SocialMediaHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile/*" 
          element={
            <ProtectedRoute>
              <SocialMediaHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/messages/*" 
          element={
            <ProtectedRoute>
              <SocialMediaHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/new-post" 
          element={
            <ProtectedRoute>
              <SocialMediaHome />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      
      {/* PWA Install Banner - shows globally when conditions are met */}
      <InstallBanner />
      
      {/* PWA Debug Component - only shows in development */}
      <PWADebug />
    </>
  );
}
