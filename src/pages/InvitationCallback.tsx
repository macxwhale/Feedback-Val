
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useInvitationAcceptance } from '@/hooks/useInvitationAcceptance';

export const InvitationCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { acceptInvitation } = useInvitationAcceptance();
  
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const invitationToken = searchParams.get('invitation_token') || 
                         searchParams.get('token') || 
                         sessionStorage.getItem('invitation_token');

  useEffect(() => {
    if (!authLoading && user && invitationToken) {
      processInvitation();
    } else if (!authLoading && !user) {
      // User is not authenticated, redirect to sign in
      navigate(`/auth?invitation=${invitationToken}`);
    } else if (!authLoading && !invitationToken) {
      // No invitation token, redirect to home
      navigate('/');
    }
  }, [user, authLoading, invitationToken]);

  const processInvitation = async () => {
    if (!invitationToken) {
      setError('No invitation token provided');
      setProcessing(false);
      return;
    }

    try {
      setProcessing(true);
      const result = await acceptInvitation(invitationToken);
      
      if (result.success && result.organization) {
        setSuccess(true);
        // Clear the token from storage
        sessionStorage.removeItem('invitation_token');
        
        // Redirect to organization dashboard after a short delay
        setTimeout(() => {
          navigate(`/admin/${result.organization!.slug}`);
        }, 2000);
      } else {
        setError(result.error || 'Failed to process invitation');
      }
    } catch (error) {
      console.error('Error processing invitation:', error);
      setError('An unexpected error occurred');
    } finally {
      setProcessing(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    processInvitation();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (authLoading || processing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-center">
              {authLoading ? 'Authenticating...' : 'Processing your invitation...'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-green-600 mb-2">
                Welcome to the team!
              </h2>
              <p className="text-gray-600 mb-4">
                You have successfully joined the organization. Redirecting to dashboard...
              </p>
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-gray-500">Redirecting...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            
            <div className="flex space-x-2">
              <Button onClick={handleRetry} variant="outline" className="flex-1">
                Try Again
              </Button>
              <Button onClick={handleGoHome} className="flex-1">
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};
