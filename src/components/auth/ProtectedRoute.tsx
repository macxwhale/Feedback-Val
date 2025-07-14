
import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from './AuthWrapper';
import { useOrganizationAdmin } from '@/hooks/useOrganizationAdmin';
import { useRBAC } from '@/hooks/useRBAC';
import { SystemAdminRequired } from './SystemAdminRequired';
import { OrganizationAdminRequired } from './OrganizationAdminRequired';
import { AuthenticationRequired } from './AuthenticationRequired';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireOrgAdmin?: boolean;
  requireOrgMembership?: boolean; // New prop for any org membership
  showAccessDeniedPage?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requireOrgAdmin = false,
  requireOrgMembership = false, // New prop
  showAccessDeniedPage = true
}) => {
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const { slug } = useParams<{ slug: string }>();

  try {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const { isOrgAdmin: isCurrentOrgAdmin, loading: orgAdminLoading, organizationId } = useOrganizationAdmin(
      (requireOrgAdmin || requireOrgMembership) ? slug : undefined
    );
    
    // Use RBAC hook to check if user has any role in the organization
    const { userRole, isLoading: rbacLoading } = useRBAC(organizationId);

    const loading = authLoading || 
      (requireOrgAdmin ? orgAdminLoading : false) || 
      (requireOrgMembership ? rbacLoading : false);

    console.log('ProtectedRoute check:', {
      user: !!user,
      isAdmin,
      requireAdmin,
      requireOrgAdmin,
      requireOrgMembership,
      slug,
      isCurrentOrgAdmin,
      userRole,
      organizationId,
      loading
    });

    // Use effect to delay showing access denied to prevent flashing
    useEffect(() => {
      if (!loading) {
        let hasAccess = false;
        
        if (!user) {
          hasAccess = false;
        } else if (requireAdmin) {
          hasAccess = isAdmin;
        } else if (requireOrgAdmin) {
          hasAccess = isCurrentOrgAdmin || isAdmin;
        } else if (requireOrgMembership) {
          // Allow access if user has any role in the organization or is system admin
          hasAccess = !!userRole || isAdmin;
        } else {
          hasAccess = true; // No special requirements
        }
        
        if (!hasAccess) {
          const timer = setTimeout(() => setShowAccessDenied(true), 100);
          return () => clearTimeout(timer);
        } else {
          setShowAccessDenied(false);
        }
      }
    }, [loading, user, isAdmin, isCurrentOrgAdmin, userRole, requireAdmin, requireOrgAdmin, requireOrgMembership]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    if (!user) {
      console.log('ProtectedRoute: No user, showing auth required');
      if (showAccessDeniedPage) {
        return <AuthenticationRequired />;
      }
      return <Navigate to="/auth" replace />;
    }

    if (requireAdmin && !isAdmin) {
      console.log('ProtectedRoute: System admin required but user is not admin');
      if (showAccessDenied) {
        if (showAccessDeniedPage) {
          return <SystemAdminRequired />;
        }
        return <Navigate to="/" replace />;
      }
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Verifying permissions...</p>
          </div>
        </div>
      );
    }

    if (requireOrgAdmin && !isCurrentOrgAdmin && !isAdmin) {
      console.log('ProtectedRoute: Org admin required but user is not org admin');
      if (showAccessDenied) {
        if (showAccessDeniedPage) {
          return <OrganizationAdminRequired />;
        }
        return <Navigate to="/" replace />;
      }
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Verifying permissions...</p>
          </div>
        </div>
      );
    }

    if (requireOrgMembership && !userRole && !isAdmin) {
      console.log('ProtectedRoute: Org membership required but user has no role');
      if (showAccessDenied) {
        if (showAccessDeniedPage) {
          return <OrganizationAdminRequired />;
        }
        return <Navigate to="/" replace />;
      }
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Verifying permissions...</p>
          </div>
        </div>
      );
    }

    console.log('ProtectedRoute: Access granted');
    return <>{children}</>;
  } catch (error) {
    // If useAuth fails (context not available), redirect to auth
    console.error('Auth context not available:', error);
    if (showAccessDeniedPage) {
      return <AuthenticationRequired />;
    }
    return <Navigate to="/auth" replace />;
  }
};
