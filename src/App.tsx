
import React, { Suspense, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useAuth, AuthProvider } from './components/auth/AuthWrapper';
import { AuthenticationRequired } from './components/auth/AuthenticationRequired';
import { OrganizationAdminDashboard } from './components/admin/OrganizationAdminDashboard';
import { OrganizationProvider } from './context/OrganizationContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { SystemAdminRequired } from './components/auth/SystemAdminRequired';
import { LandingPage } from './components/landing/LandingPage';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { AccessDeniedPage } from './components/auth/AccessDeniedPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

const AppContent: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('AppContent: User, Admin, Loading', { user: !!user, isAdmin, loading });
  }, [user, isAdmin, loading]);

  // Show a loading indicator while the auth state is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/access-denied" element={<AccessDeniedPage type="authentication" />} />
        
        <Route
          path="/"
          element={user ? (
            isAdmin ? (
              <Navigate to="/admin" replace state={{ from: location }} />
            ) : (
              <Navigate to="/org" replace state={{ from: location }} />
            )
          ) : (
            <LandingPage />
          )}
        />

        <Route
          path="/auth"
          element={user ? <Navigate to="/" replace state={{ from: location }} /> : <AuthenticationRequired />}
        />

        <Route 
          path="/admin/:slug" 
          element={
            <ProtectedRoute requireOrgMembership={true}>
              <OrganizationProvider>
                <OrganizationAdminDashboard />
              </OrganizationProvider>
            </ProtectedRoute>
          } 
        />

        {/* Public organization page - no auth required */}
        <Route
          path="/org/:slug"
          element={
            <OrganizationProvider>
              <div>Public Organization Page</div>
            </OrganizationProvider>
          }
        />

        {/* Public feedback page - no auth required */}
        <Route
          path="/:slug"
          element={
            <OrganizationProvider>
              <div>Public Feedback Page</div>
            </OrganizationProvider>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </>
  );
};

export default App;
