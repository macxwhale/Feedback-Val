import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthWrapper';

interface InvitationData {
  invitation_id: string;
  email: string;
  organization_id: string;
  organization_name: string;
  organization_slug: string;
  role: string;
  enhanced_role: string;
  expires_at: string;
  is_valid: boolean;
  error_message?: string;
}

export const InvitationAccept: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    validateInvitation();
  }, [token]);

  const validateInvitation = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('validate_invitation_token', {
        p_token: token
      });

      if (error) {
        console.error('Error validating invitation:', error);
        setError('Failed to validate invitation');
        return;
      }

      if (!data || data.length === 0) {
        setError('Invalid invitation token');
        return;
      }

      const invitation = data[0];
      setInvitationData(invitation);

      if (!invitation.is_valid) {
        setError(invitation.error_message || 'Invalid invitation');
      }
    } catch (error) {
      console.error('Error validating invitation:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!user || !token) {
      // Redirect to sign in with invitation context
      navigate(`/auth?invitation=${token}`);
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('process-organization-invitation', {
        body: { invitationToken: token }
      });

      if (error) {
        console.error('Error processing invitation:', error);
        setError('Failed to process invitation');
        return;
      }

      if (data?.success) {
        setSuccess(true);
        // Redirect to the organization dashboard after 2 seconds
        setTimeout(() => {
          navigate(`/admin/${data.organization.slug}`);
        }, 2000);
      } else {
        setError(data?.error || 'Failed to accept invitation');
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      setError('An unexpected error occurred');
    } finally {
      setProcessing(false);
    }
  };

  const handleSignIn = () => {
    navigate(`/auth?invitation=${token}`);
  };

  const handleSignUp = () => {
    navigate(`/invitation/signup?token=${token}`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading invitation...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              Invalid Invitation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              This invitation link is invalid or has expired.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              Welcome to {invitationData?.organization_name}!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              You have successfully joined the organization. You will be redirected to the dashboard shortly.
            </p>
            <div className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-gray-500">Redirecting...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {invitationData?.is_valid 
              ? `Join ${invitationData.organization_name}`
              : 'Invitation Error'
            }
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {invitationData?.is_valid && (
            <>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  You've been invited to join <strong>{invitationData.organization_name}</strong> as a{' '}
                  <strong>{invitationData.enhanced_role}</strong>.
                </p>
                <p className="text-sm text-gray-500">
                  Invitation for: {invitationData.email}
                </p>
              </div>

              {user ? (
                <div className="space-y-4">
                  {user.email?.toLowerCase() === invitationData.email.toLowerCase() ? (
                    <Button 
                      onClick={handleAcceptInvitation} 
                      disabled={processing}
                      className="w-full"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Accepting Invitation...
                        </>
                      ) : (
                        'Accept Invitation'
                      )}
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          This invitation is for {invitationData.email}, but you're signed in as {user.email}. 
                          Please sign in with the correct account.
                        </AlertDescription>
                      </Alert>
                      <Button onClick={handleSignIn} variant="outline" className="w-full">
                        Sign In with Different Account
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    To accept this invitation, you need to sign in or create an account.
                  </p>
                  <Button onClick={handleSignIn} className="w-full">
                    Sign In
                  </Button>
                  <Button onClick={handleSignUp} variant="outline" className="w-full">
                    Create Account
                  </Button>
                </div>
              )}
            </>
          )}

          {!invitationData?.is_valid && !loading && (
            <Button onClick={() => navigate('/')} className="w-full">
              Go to Homepage
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
