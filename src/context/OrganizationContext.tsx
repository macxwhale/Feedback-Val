import React, { createContext, useContext, useState, useEffect } from "react";
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

  const fetchOrganization = async () => {
    setLoading(true);
    // Attempt to get org slug from URL
    const slug = window.location.pathname.split('/')[1] || ""; // crude - parse properly for robustness
    if (!slug || slug === "") {
      setOrganization(null);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("slug", slug)
      .single();
    setOrganization(data || null);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrganization();
  }, []);

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
