
import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthWrapper";

interface OrganizationContextType {
  organization: any | null;
  loading: boolean;
  error: string | null;
  isCurrentUserOrgAdmin: boolean;
  organizationId: string | null;
  refreshOrganization: () => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error("useOrganization must be used within an OrganizationProvider");
  }
  return context;
};

const IGNORED_ROUTES = ['admin', 'auth', 'create-organization', 'login', 'terms-of-service', 'privacy-policy'];

const extractSlugFromPath = (pathname: string): string | null => {
  const pathParts = pathname.split('/').filter(p => p);

  // Handles routes like /admin/:slug/...
  if (pathParts[0] === 'admin' && pathParts.length > 1 && pathParts[1] !== 'login') {
    return pathParts[1];
  } 
  // Handles legacy /org/:slug
  else if (pathParts[0] === 'org' && pathParts.length > 1) {
    return pathParts[1];
  } 
  // Handles /:orgSlug for feedback, but ignores other top-level routes
  else if (pathParts.length > 0 && !IGNORED_ROUTES.includes(pathParts[0])) {
    return pathParts[0];
  }

  return null;
};

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organization, setOrganization] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCurrentUserOrgAdmin, setIsCurrentUserOrgAdmin] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const fetchOrganization = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const slug = extractSlugFromPath(location.pathname);

      if (!slug) {
        setOrganization(null);
        setOrganizationId(null);
        setIsCurrentUserOrgAdmin(false);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("organizations")
        .select("*")
        .eq("slug", slug)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          setError('Organization not found');
        } else {
          setError(fetchError.message || 'Failed to load organization');
        }
        setOrganization(null);
        setOrganizationId(null);
        setIsCurrentUserOrgAdmin(false);
      } else {
        setOrganization(data);
        setOrganizationId(data.id);
        setError(null);

        // Check if current user is admin of this organization
        if (user?.id) {
          // System admins have access to all organizations
          if (isAdmin) {
            console.log('OrganizationProvider: System admin access granted');
            setIsCurrentUserOrgAdmin(true);
          } else {
            try {
              const { data: isOrgAdminResult, error: adminError } = await supabase
                .rpc('is_current_user_org_admin', { org_id: data.id });

              if (adminError) {
                console.error('OrganizationProvider: Error checking admin status', adminError);
                setIsCurrentUserOrgAdmin(false);
              } else {
                const adminStatus = !!isOrgAdminResult;
                console.log('OrganizationProvider: Admin status check', {
                  userId: user.id,
                  organizationSlug: slug,
                  organizationId: data.id,
                  isOrgAdmin: adminStatus
                });
                setIsCurrentUserOrgAdmin(adminStatus);
              }
            } catch (error) {
              console.error('OrganizationProvider: Error checking admin status', error);
              setIsCurrentUserOrgAdmin(false);
            }
          }
        } else {
          setIsCurrentUserOrgAdmin(false);
        }
      }
    } catch (catchError: any) {
      setError(catchError.message || 'An unexpected error occurred');
      setOrganization(null);
      setOrganizationId(null);
      setIsCurrentUserOrgAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganization();
  }, [location.pathname, user?.id, isAdmin]);

  return (
    <OrganizationContext.Provider value={{
      organization,
      loading,
      error,
      isCurrentUserOrgAdmin,
      organizationId,
      refreshOrganization: fetchOrganization,
    }}>
      {children}
    </OrganizationContext.Provider>
  );
};
