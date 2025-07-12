
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      // Get the hash fragment and convert to search params
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      // Check if this is an invitation-related callback
      const invitationToken = searchParams.get('invitation_token') || 
                             hashParams.get('invitation_token');

      if (invitationToken) {
        // Store invitation token for processing after auth
        sessionStorage.setItem('invitation_token', invitationToken);
        navigate('/invitation/callback');
        return;
      }

      // Handle password recovery
      if (type === 'recovery' && accessToken && refreshToken) {
        const redirectUrl = `/reset-password?access_token=${accessToken}&refresh_token=${refreshToken}&type=recovery`;
        navigate(redirectUrl);
        return;
      }

      // Handle standard auth callback
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth callback error:', error);
        navigate('/auth?error=auth_callback_failed');
        return;
      }

      if (data.session) {
        // User is authenticated, redirect to admin dashboard
        navigate('/admin');
      } else {
        // No session, redirect to auth page
        navigate('/auth');
      }
    } catch (error) {
      console.error('Error in auth callback:', error);
      navigate('/auth?error=callback_failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin mr-3" />
          <span>Processing authentication...</span>
        </CardContent>
      </Card>
    </div>
  );
};
