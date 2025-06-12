
import { useState, useEffect } from 'react';
import { Organization, getOrganizationBySlug, getOrganizationByDomain } from '@/services/organizationService';

export const useOrganization = () => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectOrganization = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get current URL
        const url = new URL(window.location.href);
        const hostname = url.hostname;
        const pathname = url.pathname;

        let org: Organization | null = null;

        // Method 1: Check for custom domain
        if (hostname !== 'localhost' && !hostname.includes('lovable.app')) {
          org = await getOrganizationByDomain(hostname);
        }

        // Method 2: Check for subdomain (e.g., im-bank.feedback.com)
        if (!org && hostname.includes('.')) {
          const subdomain = hostname.split('.')[0];
          if (subdomain !== 'www' && subdomain !== 'feedback') {
            org = await getOrganizationBySlug(subdomain);
          }
        }

        // Method 3: Check for path-based routing (e.g., /org/im-bank)
        if (!org) {
          const pathMatch = pathname.match(/^\/org\/([^\/]+)/);
          if (pathMatch) {
            const slug = pathMatch[1];
            org = await getOrganizationBySlug(slug);
          }
        }

        // Method 4: Default to I&M Bank for development/fallback
        if (!org) {
          org = await getOrganizationBySlug('im-bank');
        }

        if (!org) {
          setError('Organization not found');
        } else {
          setOrganization(org);
        }
      } catch (err) {
        console.error('Error detecting organization:', err);
        setError('Failed to load organization');
      } finally {
        setIsLoading(false);
      }
    };

    detectOrganization();
  }, []);

  return { organization, isLoading, error };
};
