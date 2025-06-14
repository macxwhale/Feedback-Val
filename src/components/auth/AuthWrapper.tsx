
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isOrgAdmin: boolean;
  currentOrganization: string | null;
  currentOrganizationSlug: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOrgAdmin, setIsOrgAdmin] = useState(false);
  const [currentOrganization, setCurrentOrganization] = useState<string | null>(null);
  const [currentOrganizationSlug, setCurrentOrganizationSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUserRoles = async (userId: string) => {
    try {
      console.log('Checking user roles for:', userId);
      
      // Use the new security definer function to check admin status
      const { data: adminStatus, error: adminError } = await supabase
        .rpc('get_current_user_admin_status');
      
      if (adminError) {
        console.error('Error checking admin status:', adminError);
        setIsAdmin(false);
      } else {
        console.log('Admin status:', adminStatus);
        setIsAdmin(!!adminStatus);
      }
      
      // Check organization memberships with organization details
      const { data: orgData, error: orgError } = await supabase
        .from('organization_users')
        .select(`
          organization_id, 
          role,
          organizations(slug)
        `)
        .eq('user_id', userId)
        .single();
      
      if (orgError) {
        console.error('Error checking org memberships:', orgError);
        setIsOrgAdmin(false);
        setCurrentOrganization(null);
        setCurrentOrganizationSlug(null);
      } else {
        console.log('Org memberships:', orgData);
        const hasOrgRole = !!orgData?.organization_id;
        setIsOrgAdmin(hasOrgRole);
        setCurrentOrganization(orgData?.organization_id || null);
        setCurrentOrganizationSlug((orgData?.organizations as any)?.slug || null);
      }
    } catch (error) {
      console.error('Error checking user roles:', error);
      // Set safe defaults on error
      setIsAdmin(false);
      setIsOrgAdmin(false);
      setCurrentOrganization(null);
      setCurrentOrganizationSlug(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer role checking to avoid auth state conflicts
          setTimeout(() => {
            if (mounted) {
              checkUserRoles(session.user.id);
            }
          }, 100);
        } else {
          setIsAdmin(false);
          setIsOrgAdmin(false);
          setCurrentOrganization(null);
          setCurrentOrganizationSlug(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await checkUserRoles(session.user.id);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const redirectUrl = `${window.location.origin}/create-organization`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectUrl }
      });
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setIsOrgAdmin(false);
      setCurrentOrganization(null);
      setCurrentOrganizationSlug(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        isOrgAdmin,
        currentOrganization,
        currentOrganizationSlug,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
