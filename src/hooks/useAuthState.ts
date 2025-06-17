
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAdmin: false,
    isSuperAdmin: false,
  });

  const checkUserRoles = async (userId: string) => {
    console.log('Checking user roles for:', userId);
    
    try {
      // Check if user is super admin
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('is_super_admin')
        .eq('user_id', userId)
        .single();

      const isSuperAdmin = adminData?.is_super_admin || false;

      // Check if user is org admin
      const { data: orgAdminData } = await supabase
        .from('organization_users')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .limit(1);

      const isAdmin = isSuperAdmin || (orgAdminData && orgAdminData.length > 0);

      return { isAdmin, isSuperAdmin };
    } catch (error) {
      console.error('Error checking user roles:', error);
      return { isAdmin: false, isSuperAdmin: false };
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkUserRoles(session.user.id).then(({ isAdmin, isSuperAdmin }) => {
          setAuthState({
            user: session.user,
            loading: false,
            isAdmin,
            isSuperAdmin,
          });
        });
      } else {
        setAuthState({
          user: null,
          loading: false,
          isAdmin: false,
          isSuperAdmin: false,
        });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change in useAuthState:', event);
        
        if (session?.user) {
          const { isAdmin, isSuperAdmin } = await checkUserRoles(session.user.id);
          setAuthState({
            user: session.user,
            loading: false,
            isAdmin,
            isSuperAdmin,
          });
        } else {
          setAuthState({
            user: null,
            loading: false,
            isAdmin: false,
            isSuperAdmin: false,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return authState;
};
