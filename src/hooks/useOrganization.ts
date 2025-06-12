
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Organization, getOrganizationBySlug, getOrganizationByDomain } from '@/services/organizationService';

export const useOrganization = () => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const location = useLocation();

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

        // Method 3: Check for direct organization routing (e.g., /im-bank)
        if (!org) {
          // Extract org slug from various route patterns
          let orgSlug: string | undefined;

          // Direct organization route: /:orgSlug
          if (params.orgSlug && !pathname.startsWith('/admin') && !pathname.startsWith('/auth')) {
            orgSlug = params.orgSlug;
          }
          
          // Legacy org route: /org/:slug
          if (params.slug && pathname.startsWith('/org/')) {
            orgSlug = params.slug;
          }

          // Root path check for organization names
          if (!orgSlug && pathname !== '/auth' && pathname !== '/admin' && pathname !== '/') {
            const pathSegments = pathname.split('/').filter(Boolean);
            if (pathSegments.length === 1 && pathSegments[0] !== 'admin' && pathSegments[0] !== 'auth') {
              orgSlug = pathSegments[0];
            }
          }

          if (orgSlug) {
            org = await getOrganizationBySlug(orgSlug);
          }
        }

        // Method 4: Default to I&M Bank for root path only (fallback for development)
        if (!org && pathname === '/') {
          org = await getOrganizationBySlug('im-bank');
        }

        if (!org && pathname !== '/auth' && pathname !== '/admin') {
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
  }, [params, location.pathname]);

  return { organization, isLoading, error };
};
