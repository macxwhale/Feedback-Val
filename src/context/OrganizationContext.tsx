
import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface OrganizationContextType {
  organization: any | null;
  loading: boolean;
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

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organization, setOrganization] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchOrganization = async () => {
    setLoading(true);
    const pathParts = location.pathname.split('/').filter(p => p);

    let slug = "";
    // Handles routes like /admin/:slug/...
    if (pathParts[0] === 'admin' && pathParts.length > 1 && pathParts[1] !== 'login') {
      slug = pathParts[1];
    } 
    // Handles legacy /org/:slug
    else if (pathParts[0] === 'org' && pathParts.length > 1) {
      slug = pathParts[1];
    } 
    // Handles /:orgSlug for feedback, but ignores other top-level routes
    else if (pathParts.length > 0 && !['admin', 'auth', 'create-organization', 'login'].includes(pathParts[0])) {
      slug = pathParts[0];
    }

    if (!slug) {
      setOrganization(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error && error.code !== 'PGRST116') { // Ignore "single row not found" error
      console.error("OrganizationContext: Error fetching organization:", error);
    }

    setOrganization(data || null);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrganization();
  }, [location.pathname]);

  return (
    <OrganizationContext.Provider value={{
      organization,
      loading,
      refreshOrganization: fetchOrganization,
    }}>
      {children}
    </OrganizationContext.Provider>
  );
};
