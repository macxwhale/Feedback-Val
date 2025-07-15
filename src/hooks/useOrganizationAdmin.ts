
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthWrapper';
import { supabase } from '@/integrations/supabase/client';

export const useOrganizationAdmin = (organizationSlug?: string) => {
  const [isOrgAdmin, setIsOrgAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    let mounted = true;

    const checkOrganizationAdminStatus = async () => {
      if (!user?.id || !organizationSlug) {
        console.log('useOrganizationAdmin: No user or slug', { userId: user?.id, organizationSlug });
        setIsOrgAdmin(false);
        setOrganizationId(null);
        setLoading(false);
        return;
      }

      // System admins have access to all organizations
      if (isAdmin) {
        console.log('useOrganizationAdmin: System admin access granted');
        setIsOrgAdmin(true);
        setLoading(false);
        return;
      }

      try {
        // First, get the organization ID from the slug
        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .select('id')
          .eq('slug', organizationSlug)
          .single();

        if (orgError || !org) {
          console.error('useOrganizationAdmin: Organization not found', { organizationSlug, error: orgError });
          setIsOrgAdmin(false);
          setOrganizationId(null);
          setLoading(false);
          return;
        }

        setOrganizationId(org.id);

        // Check enhanced role only
        const { data: orgUser, error: adminError } = await supabase
          .from('organization_users')
          .select('enhanced_role')
          .eq('user_id', user.id)
          .eq('organization_id', org.id)
          .eq('status', 'active')
          .single();

        if (adminError) {
          console.error('useOrganizationAdmin: Error checking admin status', adminError);
          setIsOrgAdmin(false);
        } else {
          // Check enhanced role for admin access
          const adminStatus = orgUser?.enhanced_role && ['owner', 'admin', 'manager'].includes(orgUser.enhanced_role);
          
          console.log('useOrganizationAdmin: Admin status check', {
            userId: user.id,
            organizationSlug,
            organizationId: org.id,
            enhanced_role: orgUser?.enhanced_role,
            isOrgAdmin: adminStatus
          });
          setIsOrgAdmin(!!adminStatus);
        }
      } catch (error) {
        console.error('useOrganizationAdmin: Unexpected error', error);
        setIsOrgAdmin(false);
        setOrganizationId(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkOrganizationAdminStatus();

    return () => {
      mounted = false;
    };
  }, [user?.id, organizationSlug, isAdmin]);

  return {
    isOrgAdmin,
    loading,
    organizationId
  };
};
