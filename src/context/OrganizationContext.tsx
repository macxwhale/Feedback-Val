
import React, { createContext, useContext } from 'react';
import { Organization } from '@/services/organizationService';
import { useOrganization } from '@/hooks/useOrganization';

interface OrganizationContextType {
  organization: Organization | null;
  isLoading: boolean;
  error: string | null;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const useOrganizationContext = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganizationContext must be used within an OrganizationProvider');
  }
  return context;
};

interface OrganizationProviderProps {
  children: React.ReactNode;
}

export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({ children }) => {
  const { organization, isLoading, error } = useOrganization();

  return (
    <OrganizationContext.Provider value={{ organization, isLoading, error }}>
      {children}
    </OrganizationContext.Provider>
  );
};
