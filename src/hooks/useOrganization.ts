
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
      console.log('useOrganization - Starting detection, params:', params, 'pathname:', location.pathname);
      
      try {
        setIsLoading(true);
        setError(null);

        // Get current URL
        const url = new URL(window.location.href);
        const hostname = url.hostname;
        const pathname = url.pathname;

        console.log('useOrganization - URL info:', { hostname, pathname });

        let org: Organization | null = null;

        // Method 1: Check for custom domain (skip in development)
        if (hostname !== 'localhost' && !hostname.includes('lovable.app') && !hostname.includes('lovableproject.com')) {
          console.log('useOrganization - Checking domain:', hostname);
          try {
            org = await getOrganizationByDomain(hostname);
            console.log('useOrganization - Domain result:', org);
          } catch (domainError) {
            console.log('useOrganization - Domain check failed:', domainError);
          }
        }

        // Method 2: Check for subdomain (e.g., police-sacco.feedback.com)
        if (!org && hostname.includes('.')) {
          const subdomain = hostname.split('.')[0];
          if (subdomain !== 'www' && subdomain !== 'feedback') {
            console.log('useOrganization - Checking subdomain:', subdomain);
            try {
              org = await getOrganizationBySlug(subdomain);
              console.log('useOrganization - Subdomain result:', org);
            } catch (subdomainError) {
              console.log('useOrganization - Subdomain check failed:', subdomainError);
            }
          }
        }

        // Method 3: Check for direct organization routing (e.g., /police-sacco)
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

          console.log('useOrganization - Detected orgSlug:', orgSlug);

          if (orgSlug) {
            try {
              org = await getOrganizationBySlug(orgSlug);
              console.log('useOrganization - Slug result:', org);
            } catch (slugError) {
              console.log('useOrganization - Slug check failed:', slugError);
            }
          }
        }

        // Method 4: Default to Police Sacco for root path or if no organization found
        if (!org && (pathname === '/' || pathname.includes('police-sacco'))) {
          console.log('useOrganization - Defaulting to police-sacco');
          try {
            org = await getOrganizationBySlug('police-sacco');
            console.log('useOrganization - Default police-sacco result:', org);
          } catch (defaultError) {
            console.log('useOrganization - Default police-sacco failed:', defaultError);
          }
        }

        if (!org && pathname !== '/auth' && pathname !== '/admin' && pathname !== '/') {
          console.log('useOrganization - No organization found, setting error');
          setError('Organization not found');
        } else {
          console.log('useOrganization - Setting organization:', org);
          setOrganization(org);
        }
      } catch (err) {
        console.error('useOrganization - Error detecting organization:', err);
        setError('Failed to load organization');
      } finally {
        console.log('useOrganization - Setting loading false');
        setIsLoading(false);
      }
    };

    detectOrganization();
  }, [params, location.pathname]);

  return { organization, isLoading, error };
};
