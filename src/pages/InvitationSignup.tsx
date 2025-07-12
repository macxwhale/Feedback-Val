import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';
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

export const InvitationSignup: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingUp, setSigningUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (user) {
      // User is already signed in, redirect to invitation accept
      navigate(`/invitation/accept?token=${token}`);
      return;
    }

    if (!token) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    validateInvitation();
  }, [token, user]);

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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invitationData?.email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setSigningUp(true);
      setError(null);

      const redirectUrl = `${window.location.origin}/invitation/accept?token=${token}`;

      const { data, error } = await supabase.auth.signUp({
        email: invitationData.email,
        password: password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            invitation_token: token,
            organization_id: invitationData.organization_id
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        setError(error.message);
        return;
      }

      if (data.user && !data.session) {
        // Email confirmation required
        setError('Please check your email to confirm your account, then return to accept the invitation.');
      } else if (data.session) {
        // User is signed in, redirect to process invitation
        navigate(`/invitation/accept?token=${token}`);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setError('An unexpected error occurred during signup');
    } finally {
      setSigningUp(false);
    }
  };

  const handleSignInInstead = () => {
    navigate(`/auth?invitation=${token}`);
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

  if (!token || !invitationData?.is_valid) {
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
              {error || 'This invitation link is invalid or has expired.'}
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <p className="text-sm text-gray-600">
            Join <strong>{invitationData.organization_name}</strong> as a{' '}
            <strong>{invitationData.enhanced_role}</strong>
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={invitationData.email}
                disabled
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500">
                This email address is pre-filled from your invitation
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                minLength={6}
              />
            </div>

            <Button type="submit" disabled={signingUp} className="w-full">
              {signingUp ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                'Create Account & Join Organization'
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleSignInInstead}
                className="text-sm text-blue-600 hover:underline"
              >
                Already have an account? Sign in instead
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
