import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import SocialMediaHome from '@/components/layout/social-media-home';
import LoginPage from '@/pages/login';
import SignupPage from '@/pages/signup';
import ForgotPasswordPage from '@/pages/forgot-password';

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    // You could replace this with a loading spinner component
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      {/* Protected route */}
      <Route 
        path="/*" 
        element={
          <ProtectedRoute>
            <SocialMediaHome />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
