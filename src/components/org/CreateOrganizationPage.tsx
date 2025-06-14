
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthWrapper';

export const CreateOrganizationPage: React.FC = () => {
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
      .substring(0, 50); // Limit length
  };

  const checkSlugUnique = async (slug: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('organizations')
      .select('slug')
      .eq('slug', slug)
      .single();
    
    return !data && !error;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create an organization');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Generate base slug
      let slug = generateSlug(orgName);
      
      // Check if slug is unique, if not append number
      let isUnique = await checkSlugUnique(slug);
      let counter = 1;
      
      while (!isUnique) {
        const newSlug = `${slug}-${counter}`;
        isUnique = await checkSlugUnique(newSlug);
        if (isUnique) {
          slug = newSlug;
        }
        counter++;
        
        // Prevent infinite loop
        if (counter > 100) {
          throw new Error('Unable to generate unique slug');
        }
      }
      
      // Create organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: orgName,
          slug: slug,
          created_by_user_id: user.id,
          is_active: true
        })
        .select()
        .single();
      
      if (orgError) {
        throw orgError;
      }
      
      // Add user as organization admin
      const { error: userOrgError } = await supabase
        .from('organization_users')
        .insert({
          user_id: user.id,
          organization_id: orgData.id,
          email: user.email!,
          role: 'admin',
          status: 'active',
          accepted_at: new Date().toISOString()
        });
      
      if (userOrgError) {
        throw userOrgError;
      }
      
      toast({
        title: "Organization Created!",
        description: `Welcome to ${orgName}. You can now start collecting feedback.`,
      });
      
      // Redirect to organization dashboard
      navigate(`/admin/${slug}`);
      
    } catch (err: any) {
      console.error('Error creating organization:', err);
      setError(err.message || 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-blue-600 mb-4">
              <Activity className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Create Your Organization
            </CardTitle>
            <p className="text-gray-600">
              Set up your feedback collection hub
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  required
                  placeholder="Your Organization Name"
                  minLength={2}
                  maxLength={100}
                />
                <p className="text-sm text-gray-500 mt-1">
                  This will be used to create your unique URL
                </p>
              </div>
              
              {error && (
                <Alert>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Button type="submit" className="w-full" disabled={loading || !orgName.trim()}>
                {loading ? 'Creating...' : 'Create Organization'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
