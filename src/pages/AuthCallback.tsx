
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedLoadingSpinner } from '@/components/admin/dashboard/EnhancedLoadingSpinner';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/auth?error=' + encodeURIComponent(error.message));
          return;
        }

        if (data.session?.user) {
          // Process the invitation if user has organization metadata
          await supabase.functions.invoke('auth-callback-handler', {
            body: { userId: data.session.user.id }
          });

          // Redirect to appropriate dashboard
          const orgId = data.session.user.user_metadata?.organization_id;
          if (orgId) {
            // Get organization slug
            const { data: orgData } = await supabase
              .from('organizations')
              .select('slug')
              .eq('id', orgId)
              .single();
            
            if (orgData?.slug) {
              navigate(`/admin/${orgData.slug}`);
              return;
            }
          }

          // Default redirect
          navigate('/admin');
        } else {
          navigate('/auth');
        }
      } catch (error) {
        console.error('Callback processing error:', error);
        navigate('/auth?error=' + encodeURIComponent('Authentication failed'));
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <EnhancedLoadingSpinner text="Processing your invitation..." />
        <p className="mt-4 text-gray-600">Please wait while we set up your account...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
