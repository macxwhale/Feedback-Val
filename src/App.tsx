
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/components/auth/AuthWrapper';
import { OrganizationProvider } from '@/context/OrganizationContext';
import { Home } from '@/pages/Home';
import { Auth } from '@/pages/Auth';
import { AuthCallback } from '@/pages/AuthCallback';
import Admin from '@/pages/Admin';
import { OrganizationAdmin } from '@/pages/OrganizationAdmin';
import { ResetPassword } from '@/pages/ResetPassword';
import { Pricing } from '@/pages/Pricing';
import { InvitationAccept } from '@/pages/InvitationAccept';
import { InvitationSignup } from '@/pages/InvitationSignup';
import { InvitationCallback } from '@/pages/InvitationCallback';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <OrganizationProvider>
            <Toaster />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/:slug" element={<Admin />} />
              <Route path="/admin/:organizationSlug" element={<OrganizationAdmin />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/pricing" element={<Pricing />} />
              
              {/* Invitation-specific routes */}
              <Route path="/invitation/accept" element={<InvitationAccept />} />
              <Route path="/invitation/signup" element={<InvitationSignup />} />
              <Route path="/invitation/callback" element={<InvitationCallback />} />
            </Routes>
          </OrganizationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
