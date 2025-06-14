import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from './AuthWrapper';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orgName, setOrgName] = useState('');
  const [orgLoading, setOrgLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Helper: create organization after signup
  const createOrganizationForUser = async (email: string) => {
    setOrgLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.id) throw new Error("No user found");

      // Call the edge function
      const res = await fetch(
        `https://rigurrwjiaucodxuuzeh.functions.supabase.co/create-organization`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            userId: user.id,
            orgName,
          }),
        }
      );
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Edge function error (org create)");
      }
      toast({
        title: "Organization Created",
        description: `Welcome to ${result.organization?.name || orgName}!`,
      });

      // Redirect to org admin dashboard (optional)
      navigate(`/admin/${result.organization?.slug}`);
    } catch (err: any) {
      toast({
        title: "Error creating organization",
        description: err.message || "An error occurred. Please retry.",
        variant: "destructive"
      });
      setOrgLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
      
      // Wait a moment for auth state to update, then check roles and redirect accordingly
      setTimeout(async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            // Check if user is a system admin
            const { data: isAdmin } = await supabase
              .rpc('get_current_user_admin_status');
            
            if (isAdmin) {
              navigate('/admin');
              setLoading(false);
              return;
            }
            
            // Check if user is an organization admin
            const { data: orgData } = await supabase
              .from('organization_users')
              .select('organization_id, role, organizations(slug)')
              .eq('user_id', session.user.id)
              .single();
            
            if (orgData?.organization_id) {
              // Redirect to organization admin dashboard
              const orgSlug = (orgData.organizations as any)?.slug;
              if (orgSlug) {
                navigate(`/admin/${orgSlug}`);
              } else {
                // Fallback to home if no slug found
                navigate('/');
              }
            } else {
              // Regular user, redirect to home
              navigate('/');
            }
          } else {
            navigate('/');
          }
        } catch (err) {
          console.error('Error checking user roles for redirect:', err);
          // Fallback to home on error
          navigate('/');
        }
        setLoading(false);
      }, 500);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await signUp(email, password);
    
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    toast({
      title: "Account created!",
      description: "Please check your email to verify your account. After verification, you'll be prompted to create your organization.",
    });

    // Wait for auth to be available then create organization
    setTimeout(() => {
      createOrganizationForUser(email);
    }, 800);

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-blue-600 mb-4">
              <Activity className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Welcome to Pulsify
            </CardTitle>
            <p className="text-gray-600">
              Sign in to your organization account
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="your-email@company.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                    />
                  </div>
                  {error && (
                    <Alert>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="your-email@company.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Create a password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input
                      id="org-name"
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g. My Company"
                    />
                  </div>
                  {error && (
                    <Alert>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={loading || orgLoading}>
                    {(loading || orgLoading) ? 'Creating account...' : 'Sign Up'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                System administrator? <Link to="/admin/login" className="text-red-600 hover:text-red-800">Admin Login</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
