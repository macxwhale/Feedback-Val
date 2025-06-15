import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

const checkUserRoles = async (userId: string) => {
  try {
    console.log('Checking user roles for:', userId);
    
    const { data: adminStatus, error: adminError } = await supabase
      .rpc('get_current_user_admin_status');
    
    if (adminError) {
      console.error('Error checking admin status:', adminError);
    }
    
    const { data: orgData, error: orgError } = await supabase
      .from('organization_users')
      .select('organization_id, role, organizations(slug)')
      .eq('user_id', userId)
      .single();
    
    if (orgError && orgError.code !== 'PGRST116') {
      console.error('Error checking org memberships:', orgError);
    }

    const isAdmin = !!adminStatus;
    const hasOrgRole = !!orgData?.organization_id;

    return {
      isAdmin,
      isOrgAdmin: hasOrgRole,
      currentOrganization: orgData?.organization_id || null,
      currentOrganizationSlug: (orgData?.organizations as any)?.slug || null,
    };
  } catch (error) {
    console.error('Error checking user roles:', error);
    return {
      isAdmin: false,
      isOrgAdmin: false,
      currentOrganization: null,
      currentOrganizationSlug: null,
    };
  }
};

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOrgAdmin, setIsOrgAdmin] = useState(false);
  const [currentOrganization, setCurrentOrganization] = useState<string | null>(null);
  const [currentOrganizationSlug, setCurrentOrganizationSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // `onAuthStateChange` fires immediately with the current session if it exists,
    // so we can rely on it as the single source of truth and avoid race conditions.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change in useAuthState:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Per Supabase docs, to avoid potential client deadlocks,
          // we perform async operations inside a timeout.
          setTimeout(async () => {
            if (mounted) {
              const roles = await checkUserRoles(session.user.id);
              setIsAdmin(roles.isAdmin);
              setIsOrgAdmin(roles.isOrgAdmin);
              setCurrentOrganization(roles.currentOrganization);
              setCurrentOrganizationSlug(roles.currentOrganizationSlug);
              setLoading(false); // We are done loading only after roles are fetched.
            }
          }, 0);
        } else {
          // No user session, so we can stop loading.
          setIsAdmin(false);
          setIsOrgAdmin(false);
          setCurrentOrganization(null);
          setCurrentOrganizationSlug(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);
  
  return { user, session, isAdmin, isOrgAdmin, currentOrganization, currentOrganizationSlug, loading };
};
