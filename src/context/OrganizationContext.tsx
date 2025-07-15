
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthWrapper';

interface Organization {
  id: string;
  name: string;
  slug: string;
  domain: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  plan_type: string;
  trial_ends_at: string;
  billing_email: string;
  max_responses: number;
  created_by_user_id: string | null;
  settings: any;
  feedback_header_title: string;
  feedback_header_subtitle: string;
  welcome_screen_title: string;
  welcome_screen_description: string;
  thank_you_title: string;
  thank_you_message: string;
  custom_css: any;
  flow_configuration: any;
  logo_storage_path: string | null;
  features_config: any;
  updated_by_user_id: string | null;
  sms_enabled: boolean;
  sms_sender_id: string;
  sms_settings: any;
  webhook_secret: string;
  flask_sms_wrapper_url: string | null;
  sms_integration_type: string;
}

interface OrganizationContextType {
  organization: Organization | null;
  loading: boolean;
  error: Error | null;
  isCurrentUserOrgAdmin: boolean;
  refetch: () => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { slug } = useParams<{ slug?: string }>();
  const { user, isAdmin } = useAuth();
  const [isCurrentUserOrgAdmin, setIsCurrentUserOrgAdmin] = useState(false);

  const { data: organization, isLoading: loading, error, refetch } = useQuery({
    queryKey: ['organization', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Check if current user is org admin using enhanced_role
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.id || !organization?.id) {
        setIsCurrentUserOrgAdmin(false);
        return;
      }

      // System admins have access to all organizations
      if (isAdmin) {
        console.log('OrganizationProvider: System admin access granted');
        setIsCurrentUserOrgAdmin(true);
        return;
      }

      try {
        const { data: orgUser, error } = await supabase
          .from('organization_users')
          .select('enhanced_role')
          .eq('user_id', user.id)
          .eq('organization_id', organization.id)
          .eq('status', 'active')
          .single();

        if (error) {
          console.error('OrganizationProvider: Error checking admin status', error);
          setIsCurrentUserOrgAdmin(false);
        } else {
          // Check enhanced_role for admin access
          const adminStatus = orgUser?.enhanced_role && ['owner', 'admin', 'manager'].includes(orgUser.enhanced_role);
          
          console.log('OrganizationProvider: Admin status check', {
            userId: user.id,
            organizationSlug: slug,
            organizationId: organization.id,
            enhanced_role: orgUser?.enhanced_role,
            isOrgAdmin: adminStatus
          });
          
          setIsCurrentUserOrgAdmin(!!adminStatus);
        }
      } catch (error) {
        console.error('OrganizationProvider: Unexpected error', error);
        setIsCurrentUserOrgAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user?.id, organization?.id, isAdmin, slug]);

  const value: OrganizationContextType = {
    organization,
    loading,
    error: error as Error | null,
    isCurrentUserOrgAdmin,
    refetch,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};
