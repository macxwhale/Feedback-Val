import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import type { Organization } from '@/services/organizationService.types';
import { getOrganizationBySlug, getOrganizationByDomain } from '@/services/organizationQueries';

export const useOrganization = () => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const location = useLocation();
  
  // Use ref to prevent infinite loops
  const lastProcessedPath = useRef<string>('');
  const isProcessing = useRef<boolean>(false);

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Prevent processing the same path multiple times or concurrent processing
    if (currentPath === lastProcessedPath.current || isProcessing.current) {
      return;
    }

    const detectOrganization = async () => {
      console.log('useOrganization - Starting detection for path:', currentPath);
      
      // Mark as processing
      isProcessing.current = true;
      lastProcessedPath.current = currentPath;
      
      try {
        setIsLoading(true);
        setError(null);

        // Get current URL
        const url = new URL(window.location.href);
        const hostname = url.hostname;

        console.log('useOrganization - URL info:', { hostname, pathname: currentPath });

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
          if (subdomain !== 'www' && subdomain !== 'feedback' && !subdomain.includes('preview--')) {
            console.log('useOrganization - Checking subdomain:', subdomain);
            try {
              org = await getOrganizationBySlug(subdomain);
              console.log('useOrganization - Subdomain result:', org);
            } catch (subdomainError) {
              console.log('useOrganization - Subdomain check failed:', subdomainError);
            }
          }
        }

        // Method 3: Check for direct organization routing (e.g., /org/police-sacco or /admin/im-bank)
        if (!org) {
          let orgSlug: string | undefined;

          // Admin route: /admin/:slug
          if (params.slug && currentPath.startsWith('/admin/')) {
            orgSlug = params.slug;
            console.log('useOrganization - Admin route detected, slug:', orgSlug);
          }
          // Legacy org route: /org/:slug
          else if (params.slug && currentPath.startsWith('/org/')) {
            orgSlug = params.slug;
          }
          // Direct organization route: /:orgSlug (but not admin/auth routes)
          else if (params.orgSlug && !currentPath.startsWith('/admin') && !currentPath.startsWith('/auth')) {
            orgSlug = params.orgSlug;
          }
          // Root path check for organization names
          else if (currentPath !== '/auth' && currentPath !== '/admin' && currentPath !== '/') {
            const pathSegments = currentPath.split('/').filter(Boolean);
            if (pathSegments.length >= 1 && pathSegments[0] !== 'admin' && pathSegments[0] !== 'auth') {
              // For /org/police-sacco, take the second segment
              if (pathSegments[0] === 'org' && pathSegments[1]) {
                orgSlug = pathSegments[1];
              }
              // For direct /police-sacco routes
              else if (pathSegments[0] !== 'org') {
                orgSlug = pathSegments[0];
              }
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
        if (!org && (currentPath === '/' || currentPath.includes('police-sacco'))) {
          console.log('useOrganization - Defaulting to police-sacco');
          try {
            org = await getOrganizationBySlug('police-sacco');
            console.log('useOrganization - Default police-sacco result:', org);
          } catch (defaultError) {
            console.log('useOrganization - Default police-sacco failed:', defaultError);
          }
        }

        if (!org && currentPath !== '/auth' && currentPath !== '/admin' && currentPath !== '/') {
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
        isProcessing.current = false;
      }
    };

    detectOrganization();
  }, [params.slug, params.orgSlug, location.pathname]); // Only depend on the specific params we need

  return { organization, isLoading, error };
};
