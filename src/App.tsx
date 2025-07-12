
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/auth/AuthWrapper';
import { OrganizationProvider } from '@/context/OrganizationContext';
import Home from '@/pages/Home';
import Auth from '@/pages/Auth';
import Admin from '@/pages/Admin';
import { OrganizationAdmin } from '@/pages/OrganizationAdmin';
import CreateOrganization from '@/pages/CreateOrganization';
import Pricing from '@/pages/Pricing';
import AuthCallback from '@/pages/AuthCallback';
import ResetPassword from '@/pages/ResetPassword';
import { InvitationAccept } from '@/pages/InvitationAccept';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <OrganizationProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth-callback" element={<AuthCallback />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/create-organization" element={<CreateOrganization />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/:slug" element={<OrganizationAdmin />} />
                <Route path="/invitation/accept" element={<InvitationAccept />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </OrganizationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
